'use client'
import { RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

const encouragements = [
  '三代之内，必出兴家之子',
  '别人少年得志你莫及，大器晚成显真章',
  '天道酬勤，功不唐捐',
  '千淘万漉虽辛苦，吹尽狂沙始到金',
  '长风破浪会有时，直挂云帆济沧海',
  '宝剑锋从磨砺出，梅花香自苦寒来',
  '海纳百川，有容乃大；壁立千仞，无欲则刚',
  '天行健，君子以自强不息',
  '穷且益坚，不坠青云之志',
  '青山遮不住，毕竟东流去',
  '路漫漫其修远兮，吾将上下而求索',
  '莫愁前路无知己，天下谁人不识君',
  '老当益壮，宁移白首之心；穷且益坚，不坠青云之志',
  '山重水复疑无路，柳暗花明又一村',
  '沉舟侧畔千帆过，病树前头万木春',
  '不经一番寒彻骨，怎得梅花扑鼻香',
  '书山有路勤为径，学海无涯苦作舟',
  '天将降大任于斯人也，必先苦其心志',
  '精诚所至，金石为开',
  '积土成山，风雨兴焉；积水成渊，蛟龙生焉',
]

const Encouragement = () => {
  const [encouragement, setEncouragement] = useState('')

  const getRandomEncouragement = () => {
    const randomIndex = Math.floor(Math.random() * encouragements.length)
    setEncouragement(encouragements[randomIndex])
  }

  useEffect(() => {
    getRandomEncouragement()
  }, [])

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-2xl mx-auto p-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">每日鼓励</h1>
        <div className="min-h-[120px] flex items-center justify-center">
          <p className="text-2xl text-green-600 font-medium leading-relaxed">
            {encouragement}
          </p>
        </div>
      </div>
      <Button
        onClick={getRandomEncouragement}
        className="flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        换一句
      </Button>
    </div>
  )
}

export default Encouragement
