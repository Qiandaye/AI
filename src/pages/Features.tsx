import { useState } from 'react'
import { Bell, Lock, Palette, Wifi, Bluetooth, Volume2, Monitor, Cloud, Mail, MessageSquare } from 'lucide-react'

const features = [
  { icon: <Bell size={28} />, title: '通知', desc: '及时获取重要信息', color: 'from-orange-400 to-red-500' },
  { icon: <Lock size={28} />, title: '安全', desc: '保护您的隐私', color: 'from-green-400 to-emerald-500' },
  { icon: <Palette size={28} />, title: '主题', desc: '个性化界面', color: 'from-pink-400 to-rose-500' },
  { icon: <Wifi size={28} />, title: '网络', desc: '快速连接', color: 'from-blue-400 to-cyan-500' },
  { icon: <Bluetooth size={28} />, title: '蓝牙', desc: '设备连接', color: 'from-indigo-400 to-blue-500' },
  { icon: <Volume2 size={28} />, title: '声音', desc: '音量控制', color: 'from-purple-400 to-violet-500' },
  { icon: <Monitor size={28} />, title: '显示', desc: '屏幕设置', color: 'from-teal-400 to-cyan-500' },
  { icon: <Cloud size={28} />, title: '云存储', desc: '数据同步', color: 'from-gray-400 to-slate-500' },
  { icon: <Mail size={28} />, title: '邮件', desc: '邮件管理', color: 'from-amber-400 to-orange-500' },
  { icon: <MessageSquare size={28} />, title: '消息', desc: '即时通讯', color: 'from-lime-400 to-green-500' },
]

export default function Features() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    notif: true,
    sound: true,
    dark: false,
    wifi: true,
    bluetooth: false,
  })
  const [slider, setSlider] = useState(75)

  const toggle = (key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen pb-24 bg-gray-50 dark:bg-gray-900">
      <div className="px-6 pt-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">功能演示</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">交互控件</h2>
            
            <div className="space-y-6">
              {[
                { key: 'notif', label: '接收通知', icon: Bell },
                { key: 'wifi', label: 'Wi-Fi', icon: Wifi },
                { key: 'bluetooth', label: '蓝牙', icon: Bluetooth },
                { key: 'sound', label: '声音', icon: Volume2 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                  </div>
                  <button
                    onClick={() => toggle(item.key)}
                    className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                      toggles[item.key] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div 
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                        toggles[item.key] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-700 dark:text-gray-300">音量</span>
                <span className="text-gray-500 dark:text-gray-400">{slider}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={slider}
                onChange={(e) => setSlider(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="mt-8 flex gap-4">
              <button className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                主要按钮
              </button>
              <button className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                次要按钮
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
