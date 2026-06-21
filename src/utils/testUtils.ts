import { DiaryRecord } from '../types';
import { formatDate } from './dateUtils';
import { subDays } from 'date-fns';

const SAMPLE_CONTENTS = [
  '今天一起去了新开的那家咖啡店，环境很温馨，她点了一杯拿铁，我点了一杯美式。下午在那里聊了很久，感觉时间过得好快。',
  '晚上一起在家做饭，她教我做了她的拿手菜——番茄炒蛋。虽然我炒糊了一点，但她还是说很好吃，心里暖暖的。',
  '周末一起去爬山，天气很好，风景也很美。虽然累得不行，但站在山顶俯瞰整个城市的感觉真的很棒。',
  '今天是我们认识一周年的纪念日，准备了惊喜礼物。她看到的时候眼睛红红的，说这是她收到过最好的礼物。',
  '下雨了，我们被困在便利店门口。她买了一把透明的伞，我们挤在一把伞下走回家，衣服湿了一半但笑得很开心。',
  '一起看了一部老电影，是她最喜欢的《泰坦尼克号》。看到最后她又哭了，我给她递纸巾，她靠在我肩膀上说有我真好。',
  '今天她生日，我亲手做了一个蛋糕。虽然卖相不怎么样，但她一口气吃了两大块，说这是她吃过最好吃的蛋糕。',
  '一起去海边看日落，夕阳把天空染成了橙红色。我们手牵手走在沙滩上，海浪拍打着脚踝，希望时间能停在这一刻。',
  '搬家了，虽然很累，但是看着我们一起布置的小窝，心里特别满足。以后这里就是我们的小天地了。',
  '今天吵架了，因为一点小事。后来她主动给我发消息道歉，其实我也有错。感情就是这样，互相体谅才能走得更远。',
  '她生病了，我请假在家照顾她。给她熬了粥，喂她吃药。看着她虚弱的样子，心里特别心疼，希望她快点好起来。',
  '一起去听了演唱会，是我们都喜欢的乐队。现场气氛超棒，我们跟着音乐一起唱一起跳，嗓子都哑了但特别开心。',
];

const SAMPLE_TAGS = [
  ['约会', '咖啡', '开心'],
  ['做饭', '居家', '温馨'],
  ['运动', '爬山', '风景'],
  ['纪念日', '礼物', '感动'],
  ['雨天', '散步', '浪漫'],
  ['电影', '居家', '感动'],
  ['生日', '蛋糕', '惊喜'],
  ['海边', '日落', '浪漫'],
  ['搬家', '居家', '温馨'],
  ['吵架', '和好', '成长'],
  ['生病', '照顾', '心疼'],
  ['演唱会', '音乐', '开心'],
];

export function generateMockRecords(count: number): DiaryRecord[] {
  const records: DiaryRecord[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = formatDate(subDays(today, i * 2));
    const contentIndex = i % SAMPLE_CONTENTS.length;
    const tags = SAMPLE_TAGS[contentIndex];
    const rating = (i % 5) + 1;

    records.push({
      id: `test-record-${i}`,
      date,
      rating,
      content: SAMPLE_CONTENTS[contentIndex],
      tags: [...tags],
      createdAt: Date.now() - i * 86400000,
      updatedAt: Date.now() - i * 86400000,
    });
  }

  return records;
}

export const TEST_CASES = {
  empty: {
    name: '空状态',
    count: 0,
    description: '没有任何记录时的显示',
  },
  single: {
    name: '单条记录',
    count: 1,
    description: '只有1条记录时，上下都不应该有连线',
  },
  two: {
    name: '两条记录',
    count: 2,
    description: '2条记录时，中间有一段连线',
  },
  few: {
    name: '少量记录 (5条)',
    count: 5,
    description: '5条记录，验证基本连续性',
  },
  many: {
    name: '多条记录 (12条)',
    count: 12,
    description: '12条记录，验证长列表衔接不中断',
  },
  manyMore: {
    name: '大量记录 (20条)',
    count: 20,
    description: '20条记录，验证滚动场景和链路完整性',
  },
};

export type TestCaseKey = keyof typeof TEST_CASES;
