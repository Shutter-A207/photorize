export interface CardProps {
    imgSrc: string;
    imgAlt: string;
    title: string;
    description: string[];
  }
  
  export const guide: CardProps[] = [
    {
      imgSrc: '/assets/Guide/guide1.png',
      imgAlt: 'Guide 1',
      title: '#추억기록',
      description: [
        '나의 네컷사진을 저장하고',
        '추억으로 기록해요.',
      ],
    },
    {
      imgSrc: '/assets/Guide/guide2.png',
      imgAlt: '추억공유',
      title: '#추억공유',
      description: [
          '연인, 친구들과 함께',
          '우리의 추억을 공유해요.',
        ],
    },
    {
      imgSrc: '/assets/Guide/guide3.png',
      imgAlt: '포즈 찾기',
      title: '#포즈찾기',
      description: [
        '인원수에 맞는',
        '다양한 네컷 포즈를 찾아봐요.',
      ],
    },
    {
      imgSrc: '/assets/Guide/guide4.png',
      imgAlt: 'Example Image 3',
      title: '#네컷스팟',
      description: [
        '내 주변의 네컷 스팟은 물론',
        '지금까지의 추억을 지도로 확인해요.',
      ],
    },
  ];
  