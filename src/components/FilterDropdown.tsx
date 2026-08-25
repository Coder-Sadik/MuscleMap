'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Props = {
  value: string
  options: string[]
  onChange: (val: string) => void
  placeholder: string
}

export function FilterDropdown({ value, options, onChange, placeholder }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className={`flex items-center justify-between gap-2 px-4 py-2 bg-zinc-900 border rounded-full text-xs font-medium transition-colors outline-none shrink-0 ${
          isOpen 
            ? 'border-emerald-500 text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]' 
            : 'border-white/10 text-white hover:bg-zinc-800'
        }`}
      >
        {value === 'All' ? placeholder : value}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180 text-emerald-500' : 'text-zinc-500'}`} />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        sideOffset={8}
        className="min-w-[160px] bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-1 z-[100]"
      >
        <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt}
              onClick={() => onChange(opt)}
              className={`px-4 py-2.5 my-0.5 text-sm cursor-pointer rounded-lg transition-colors focus:bg-zinc-800 focus:text-white ${
                value === opt 
                  ? 'text-emerald-400 bg-emerald-500/10 font-bold focus:bg-emerald-500/20 focus:text-emerald-400' 
                  : 'text-zinc-300'
              }`}
            >
              {opt === 'All' ? placeholder : opt}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
