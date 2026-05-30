import { Rocket, Star, Heart, CheckCircle, Sparkles, Shield } from 'lucide-react'

const features = [
  { icon: <Rocket className="text-blue-500" size={28} />, title: '快速启动', desc: '极速响应，秒级加载' },
  { icon: <Star className="text-yellow-500" size={28} />, title: '优质体验', desc: '精美的用户界面' },
  { icon: <Heart className="text-red-500" size={28} />, title: '用心设计', desc: '每一个细节都很重要' },
  { icon: <CheckCircle className="text-green-500" size={28} />, title: '稳定可靠', desc: '值得信赖的产品' },
  { icon: <Sparkles className="text-purple-500" size={28} />, title: '创新功能', desc: '独特的功能体验' },
  { icon: <Shield className="text-indigo-500" size={28} />, title: '安全保障', desc: '您的数据安全第一' },
]

export default function Home() {
  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 pt-12 pb-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">欢迎使用</h1>
          <p className="text-blue-100 text-lg mb-8">一款精美的移动端应用，为您带来流畅的体验</p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            开始探索
          </button>
        </div>
      </div>

      <div className="px-6 -mt-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">精选功能</h2>
          <div className="overflow-x-auto -mx-2">
            <div className="flex gap-4 px-2 min-w-max">
              {features.slice(0, 4).map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 w-40 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">全部功能</h2>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
