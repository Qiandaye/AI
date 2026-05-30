import { Home, Zap, Settings } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type NavItem = {
  path: string
  icon: React.ReactNode
  label: string
}

const navItems: NavItem[] = [
  { path: '/', icon: <Home size={24} />, label: '首页' },
  { path: '/features', icon: <Zap size={24} />, label: '功能' },
  { path: '/settings', icon: <Settings size={24} />, label: '设置' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex items-center justify-around h-20">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full transition-all duration-200',
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              <div className={cn(
                'transition-transform duration-200',
                isActive && 'scale-110'
              )}>
                {item.icon}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
