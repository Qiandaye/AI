import { useAppStore } from '@/store/useAppStore'
import { Moon, Sun, Info, HelpCircle, FileText, User, Bell, Shield, Palette, Globe } from 'lucide-react'

export default function Settings() {
  const { theme, setTheme } = useAppStore()

  const settingsItems = [
    { icon: User, title: '账户', desc: '个人资料与账户设置' },
    { icon: Bell, title: '通知', desc: '通知偏好设置' },
    { icon: Shield, title: '隐私', desc: '隐私与安全设置' },
    { icon: Palette, title: '外观', desc: '主题与界面设置' },
    { icon: Globe, title: '语言', desc: '语言与地区设置' },
    { icon: HelpCircle, title: '帮助', desc: '常见问题与支持' },
    { icon: FileText, title: '条款', desc: '服务条款与隐私政策' },
    { icon: Info, title: '关于', desc: '应用信息与版本' },
  ]

  return (
    <div className="min-h-screen pb-24 bg-gray-50 dark:bg-gray-900">
      <div className="px-6 pt-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">设置</h1>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white">
                  {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">主题模式</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    当前: {theme === 'dark' ? '深色模式' : '亮色模式'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative w-12 h-7 rounded-full transition-colors duration-200"
                style={{ backgroundColor: theme === 'dark' ? '#3b82f6' : '#d1d5db' }}
              >
                <div 
                  className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200"
                  style={{ transform: theme === 'dark' ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            {settingsItems.map((item, index) => (
              <button
                key={index}
                className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400">
                  <item.icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-white">{item.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">版本 1.0.0</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">© 2024 移动端应用</p>
          </div>
        </div>
      </div>
    </div>
  )
}
