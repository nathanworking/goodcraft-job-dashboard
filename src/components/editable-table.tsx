'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from './input'
import { Select } from './select'
import clsx from 'clsx'

interface EditableCellProps {
  value: string | null | undefined
  onSave: (value: string) => void
  type?: 'text' | 'date' | 'select'
  options?: { value: string; label: string }[]
  placeholder?: string
}

export function EditableCell({
  value,
  onSave,
  type = 'text',
  options = [],
  placeholder,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value || '')
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      }
    }
  }, [isEditing])

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(value || '')
      setIsEditing(false)
    }
  }

  if (isEditing) {
    if (type === 'select' && options.length > 0) {
      return (
        <Select
          ref={inputRef as React.Ref<HTMLSelectElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full"
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      )
    }

    return (
      <Input
        ref={inputRef as React.Ref<HTMLInputElement>}
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full"
      />
    )
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={clsx(
        'cursor-pointer rounded px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800',
        !value && 'text-zinc-400'
      )}
    >
      {value || placeholder || 'Click to edit'}
    </div>
  )
}

interface QuickAddRowProps {
  onAdd: (data: Record<string, string>) => void
  columns: {
    key: string
    label: string
    type?: 'text' | 'date' | 'select'
    options?: { value: string; label: string }[]
    placeholder?: string
    required?: boolean
  }[]
}

export function QuickAddRow({ onAdd, columns }: QuickAddRowProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = () => {
    // Check required fields
    const missingRequired = columns
      .filter((col) => col.required)
      .some((col) => !formData[col.key])

    if (missingRequired) {
      alert('Please fill in all required fields')
      return
    }

    onAdd(formData)
    setFormData({})
    setIsAdding(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (index === columns.length - 1) {
        handleAdd()
      } else {
        // Focus next input
        const nextInput = document.querySelector(
          `[data-column-index="${index + 1}"]`
        ) as HTMLInputElement
        nextInput?.focus()
      }
    } else if (e.key === 'Escape') {
      setFormData({})
      setIsAdding(false)
    }
  }

  if (!isAdding) {
    return (
      <tr className="border-t border-zinc-200 dark:border-zinc-800">
        <td
          colSpan={columns.length + 1}
          className="px-4 py-3 text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900"
          onClick={() => setIsAdding(true)}
        >
          <span className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
            + Click to add new row
          </span>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
      {columns.map((column, index) => (
        <td key={column.key} className="px-4 py-2">
          {column.type === 'select' && column.options ? (
            <Select
              data-column-index={index}
              value={formData[column.key] || ''}
              onChange={(e) =>
                setFormData({ ...formData, [column.key]: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-full"
              required={column.required}
            >
              <option value="">Select...</option>
              {column.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              data-column-index={index}
              type={column.type || 'text'}
              value={formData[column.key] || ''}
              onChange={(e) =>
                setFormData({ ...formData, [column.key]: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, index)}
              placeholder={column.placeholder}
              required={column.required}
              className="w-full"
            />
          )}
        </td>
      ))}
      <td className="px-4 py-2">
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="text-xs px-2 py-1 bg-zinc-900 text-white rounded hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
          >
            Add
          </button>
          <button
            onClick={() => {
              setFormData({})
              setIsAdding(false)
            }}
            className="text-xs px-2 py-1 border border-zinc-300 rounded hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  )
}
