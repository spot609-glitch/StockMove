import { StockItem } from '../types';

export const DEFAULT_WATCHLIST: StockItem[] = [
  { id: '1', name: 'SK하이닉스', code: '000660', market: 'KOSPI' },
  { id: '2', name: '비에이치', code: '090460', market: 'KOSDAQ' },
  { id: '3', name: '삼성전자', code: '005930', market: 'KOSPI' },
  { id: '4', name: '알테오젠', code: '196170', market: 'KOSDAQ' },
  { id: '5', name: '한화에어로스페이스', code: '012450', market: 'KOSPI' },
  { id: '6', name: '에코프로', code: '086520', market: 'KOSDAQ' },
  { id: '7', name: '삼양식품', code: '003230', market: 'KOSPI' },
  { id: '8', name: '현대차', code: '005380', market: 'KOSPI' },
  { id: '9', name: '셀트리온', code: '068270', market: 'KOSPI' },
  { id: '10', name: '올릭스', code: '226950', market: 'KOSDAQ' },
  { id: '11', name: '엔비디아', code: 'NVDA', market: 'NASDAQ' },
  { id: '12', name: '테슬라', code: 'TSLA', market: 'NASDAQ' },
  { id: '13', name: 'NAVER', code: '035420', market: 'KOSPI' },
  { id: '14', name: '카카오', code: '035720', market: 'KOSPI' },
  { id: '15', name: '레인보우로보틱스', code: '277810', market: 'KOSDAQ' }
];

export interface StockMasterItem extends Omit<StockItem, 'id'> {
  aliases?: string[];
  sector?: string;
}

export const POPULAR_STOCKS: StockMasterItem[] = [
  // ── [바이오 / 헬스케어 / 재생의학 / 제약] ──
  { name: '엘앤씨바이오', code: '290650', market: 'KOSDAQ', aliases: ['lncbio', '엘엔씨바이오', '메가덤', 'cgb'], sector: '인체조직이식재/재생의학' },
  { name: '올릭스', code: '226950', market: 'KOSDAQ', aliases: ['olix', '오릭스', '바이오올릭스'], sector: 'RNAi 신약' },
  { name: '알테오젠', code: '196170', market: 'KOSDAQ', aliases: ['alteogen'], sector: 'SC제형변경 바이오' },
  { name: '에이비엘바이오', code: '298380', market: 'KOSDAQ', aliases: ['ablbio'], sector: '이중항체' },
  { name: '유한양행', code: '000100', market: 'KOSPI', aliases: ['yuhan', '렉라자'], sector: '제약/폐암치료제' },
  { name: '한미약품', code: '128940', market: 'KOSPI', aliases: ['hanmi'], sector: '제약' },
  { name: 'HLB', code: '028300', market: 'KOSDAQ', aliases: ['에이치엘비', 'hlb', '리보세라닙'], sector: '항암제' },
  { name: '리가켐바이오', code: '141080', market: 'KOSDAQ', aliases: ['레고켐바이오', 'legochem', 'adc'], sector: 'ADC 항암제' },
  { name: '펩트론', code: '087010', market: 'KOSDAQ', aliases: ['peptron', '스마트데포'], sector: '비만/당뇨치료제' },
  { name: '삼천당제약', code: '000250', market: 'KOSDAQ', aliases: ['samchundang'], sector: '제약/경구용인슐린' },
  { name: '휴젤', code: '145020', market: 'KOSDAQ', aliases: ['hugel', '보툴렉스'], sector: '보툴리눔톡신' },
  { name: '클래시스', code: '214150', market: 'KOSDAQ', aliases: ['classys', '슈링크'], sector: '미용의료기기' },
  { name: '파마리서치', code: '214450', market: 'KOSDAQ', aliases: ['리쥬란', 'pharmaresearch'], sector: '의료기기/스킨부스터' },
  { name: '셀트리온', code: '068270', market: 'KOSPI', aliases: ['celltrion', '짐펜트라'], sector: '바이오시밀러' },
  { name: '셀트리온제약', code: '068760', market: 'KOSDAQ', aliases: ['celltrionpharm'], sector: '제약' },
  { name: '삼성바이오로직스', code: '207940', market: 'KOSPI', aliases: ['삼바', 'samsungbio'], sector: '바이오CDMO' },
  { name: '보로노이', code: '310210', market: 'KOSDAQ', aliases: ['voronoi'], sector: '정밀표적항암제' },
  { name: '디앤디파마텍', code: '347850', market: 'KOSDAQ', aliases: ['dndpharmatech'], sector: 'GLP-1 대사질환' },
  { name: '오스코텍', code: '039200', market: 'KOSDAQ', aliases: ['oscotec'], sector: '신약개발' },
  { name: '에스티팜', code: '237690', market: 'KOSDAQ', aliases: ['stpharm'], sector: '올리고뉴클레오타이드' },
  { name: '바이오니아', code: '064550', market: 'KOSDAQ', aliases: ['bioneer'], sector: '유전자' },
  { name: '메디톡스', code: '086900', market: 'KOSDAQ', aliases: ['medytox'], sector: '보툴리눔톡신' },
  { name: '차바이오텍', code: '085660', market: 'KOSDAQ', aliases: ['chabiotech'], sector: '줄기세포' },
  { name: '대웅제약', code: '069620', market: 'KOSPI', aliases: ['daewoong'], sector: '제약' },
  { name: '종근당', code: '185750', market: 'KOSPI', aliases: ['chongkundang'], sector: '제약' },
  { name: 'JW중외제약', code: '001060', market: 'KOSPI', aliases: ['jw'], sector: '제약' },
  { name: '녹십자', code: '006280', market: 'KOSPI', aliases: ['gc녹십자'], sector: '혈액제제/백신' },
  { name: '동국제약', code: '086450', market: 'KOSDAQ', aliases: ['dongkook'], sector: '제약' },
  { name: '휴온스', code: '243070', market: 'KOSDAQ', aliases: ['huons'], sector: '제약' },
  { name: '케어젠', code: '214370', market: 'KOSDAQ', aliases: ['caregen'], sector: '펩타이드' },
  { name: '바이넥스', code: '053030', market: 'KOSDAQ', aliases: ['binex'], sector: '바이오CDMO' },
  { name: '대원제약', code: '003220', market: 'KOSPI', aliases: ['daewon'], sector: '제약' },
  { name: '코오롱티슈진', code: '950160', market: 'KOSDAQ', aliases: ['kolontissuegene'], sector: '골관절염 신약' },

  // ── [전력 인프라 / 변압기 / 전선 / 원전] ──
  { name: '산일전기', code: '062040', market: 'KOSPI', aliases: ['sanil', '산일', '특수변압기'], sector: '특수변압기/전력기기' },
  { name: 'HD현대일렉트릭', code: '267260', market: 'KOSPI', aliases: ['hyundaielectric', '변압기', '현대일렉트릭'], sector: '초고압변압기/전력기기' },
  { name: '효성중공업', code: '298040', market: 'KOSPI', aliases: ['hyosungheavy'], sector: '초고압변압기/전력인프라' },
  { name: 'LS ELECTRIC', code: '010120', market: 'KOSPI', aliases: ['lselectric', '엘에스일렉트릭'], sector: '전력배전/스마트그리드' },
  { name: '일진전기', code: '103590', market: 'KOSPI', aliases: ['iljin', '일진'], sector: '변압기/초고압케이블' },
  { name: '제룡전기', code: '033100', market: 'KOSDAQ', aliases: ['cherong'], sector: '변압기/개폐기' },
  { name: '대한전선', code: '001440', market: 'KOSPI', aliases: ['taihan', '해저케이블'], sector: '초고압전선' },
  { name: 'LS에코에너지', code: '229640', market: 'KOSPI', aliases: ['ls전선아시아', 'lseco'], sector: '전선/희토류' },
  { name: '가온전선', code: '000500', market: 'KOSPI', aliases: ['gaon'], sector: '전선' },
  { name: '세명전기', code: '017510', market: 'KOSDAQ', aliases: ['semyeong'], sector: '송배전 금구류' },
  { name: '두산에너빌리티', code: '034020', market: 'KOSPI', aliases: ['doosanenerbility', '원전', 'SMR'], sector: '원자력/가스터빈' },
  { name: '한전기술', code: '052690', market: 'KOSPI', aliases: ['kepcoe&c'], sector: '원자력발전설계' },
  { name: '한전KPS', code: '051600', market: 'KOSPI', aliases: ['kepcokps'], sector: '발전정비' },
  { name: '한국전력', code: '015760', market: 'KOSPI', aliases: ['한전', 'kepco'], sector: '전력공급' },
  { name: '우진', code: '105840', market: 'KOSPI', aliases: ['woojin'], sector: '원전계측기' },
  { name: '비에이치아이', code: '083650', market: 'KOSDAQ', aliases: ['bhi', '비에이치아이'], sector: '발전보일러/SMR' },
  { name: '우리기술', code: '032820', market: 'KOSDAQ', aliases: ['woori'], sector: '원전제어계측' },

  // ── [반도체 / HBM / 소부장] ──
  { name: '삼성전자', code: '005930', market: 'KOSPI', aliases: ['삼전', 'samsung'], sector: '반도체/스마트폰' },
  { name: 'SK하이닉스', code: '000660', market: 'KOSPI', aliases: ['하닉', 'hynix', 'skhynix', 'hbm'], sector: '메모리/HBM' },
  { name: '한미반도체', code: '042700', market: 'KOSPI', aliases: ['hanmisemi', 'tc본더'], sector: 'TC본더/HBM장비' },
  { name: '비에이치', code: '090460', market: 'KOSDAQ', aliases: ['bh', '비에이치'], sector: 'FPCB/애플부품' },
  { name: '리노공업', code: '058470', market: 'KOSDAQ', aliases: ['leeno', '리노핀'], sector: '반도체검사소켓' },
  { name: 'HPSP', code: '403870', market: 'KOSDAQ', aliases: ['hpsp', '고압수소'], sector: '고압수소어닐링' },
  { name: '이오테크닉스', code: '039030', market: 'KOSDAQ', aliases: ['eotechnics', '레이저드릴'], sector: '레이저장비' },
  { name: '하나마이크론', code: '067310', market: 'KOSDAQ', aliases: ['hanamicron'], sector: '반도체패키징/OSAT' },
  { name: '주성엔지니어링', code: '036930', market: 'KOSDAQ', aliases: ['jusung', 'ald'], sector: '원자층증착장비' },
  { name: '동진쎄미켐', code: '005290', market: 'KOSDAQ', aliases: ['dongjin'], sector: '포토레지스트/감광액' },
  { name: '원익IPS', code: '240810', market: 'KOSDAQ', aliases: ['wonik'], sector: '증착/식각장비' },
  { name: '테크윙', code: '089030', market: 'KOSDAQ', aliases: ['techwing', '큐브프로버'], sector: 'HBM검사핸들러' },
  { name: '인텍플러스', code: '064290', market: 'KOSDAQ', aliases: ['intekplus'], sector: '3D외관검사장비' },
  { name: '와이씨', code: '232140', market: 'KOSDAQ', aliases: ['yc', '와이아이케이'], sector: '메모리웨이퍼테스터' },
  { name: '솔브레인', code: '357780', market: 'KOSDAQ', aliases: ['soulbrain'], sector: '식각액/전해액' },
  { name: '피에스케이', code: '319660', market: 'KOSDAQ', aliases: ['psk'], sector: 'PR스트립장비' },
  { name: '유진테크', code: '084370', market: 'KOSDAQ', aliases: ['eugenetech'], sector: 'LP-CVD장비' },
  { name: 'ISC', code: '095340', market: 'KOSDAQ', aliases: ['isc', '실리콘러버'], sector: '테스트소켓' },
  { name: '디아이', code: '003160', market: 'KOSPI', aliases: ['di', '번인테스터'], sector: 'HBM번인테스터' },
  { name: '에프에스티', code: '036810', market: 'KOSDAQ', aliases: ['fst', '펠리클'], sector: 'EUV펠리클' },
  { name: '에스앤에스텍', code: '101490', market: 'KOSDAQ', aliases: ['snst'], sector: '블랭크마스크' },
  { name: '원익QnC', code: '074600', market: 'KOSDAQ', aliases: ['wonikqnc'], sector: '쿼츠웨어' },
  { name: '두산테스나', code: '131970', market: 'KOSDAQ', aliases: ['tesna'], sector: 'OSAT테스트' },
  { name: '해성디에스', code: '195870', market: 'KOSPI', aliases: ['haesungds'], sector: '리드프레임/차량반도체' },
  { name: '가온칩스', code: '399720', market: 'KOSDAQ', aliases: ['gaonchips', '디자인하우스'], sector: 'ASIC디자인하우스' },
  { name: '에이디테크놀로지', code: '200710', market: 'KOSDAQ', aliases: ['adtechnology'], sector: '디자인하우스' },
  { name: '오픈엣지테크놀로지', code: '394280', market: 'KOSDAQ', aliases: ['openedge', 'ip'], sector: '반도체설계IP' },
  { name: '칩스앤미디어', code: '094360', market: 'KOSDAQ', aliases: ['chips&media'], sector: '비디오코덱IP' },

  // ── [2차전지 / 양극재 / 전해액 / 배터리] ──
  { name: 'LG에너지솔루션', code: '373220', market: 'KOSPI', aliases: ['엔솔', 'lgensol'], sector: '배터리셀' },
  { name: '에코프로', code: '086520', market: 'KOSDAQ', aliases: ['ecopro'], sector: '이차전지지주' },
  { name: '에코프로비엠', code: '247540', market: 'KOSDAQ', aliases: ['ecoprobm'], sector: '하이니켈양극재' },
  { name: '에코프로머티', code: '450080', market: 'KOSPI', aliases: ['ecopromati'], sector: '전구체' },
  { name: 'POSCO홀딩스', code: '005490', market: 'KOSPI', aliases: ['포스코', 'posco'], sector: '철강/리튬/이차전지' },
  { name: '포스코퓨처엠', code: '003670', market: 'KOSPI', aliases: ['poscofuturem'], sector: '양극재/음극재' },
  { name: '삼성SDI', code: '006400', market: 'KOSPI', aliases: ['samsungsdi'], sector: '각형/전고체배터리' },
  { name: '엔켐', code: '348370', market: 'KOSDAQ', aliases: ['enchem'], sector: '전해액' },
  { name: '엘앤에프', code: '066970', market: 'KOSPI', aliases: ['lnf'], sector: '양극재' },
  { name: 'LG화학', code: '051910', market: 'KOSPI', aliases: ['lgchem'], sector: '화학/첨단소재' },
  { name: '코스모신소재', code: '005070', market: 'KOSPI', aliases: ['cosmo'], sector: '양극재' },
  { name: '대주전자재료', code: '078600', market: 'KOSDAQ', aliases: ['daejoo', '실리콘음극재'], sector: '실리콘음극재' },
  { name: '씨아이에스', code: '222080', market: 'KOSDAQ', aliases: ['cis'], sector: '전극공정장비' },
  { name: '나노신소재', code: '121600', market: 'KOSDAQ', aliases: ['anp', 'cnt'], sector: 'CNT도전재' },
  { name: '피엔티', code: '137400', market: 'KOSDAQ', aliases: ['pnt', '롤투롤'], sector: '롤투롤코터장비' },

  // ── [방산 / 항공우주 / 조선] ──
  { name: '한화에어로스페이스', code: '012450', market: 'KOSPI', aliases: ['한화에어로', 'hanwhaaero', 'k9'], sector: '자주포/천무/항공엔진' },
  { name: '현대로템', code: '064350', market: 'KOSPI', aliases: ['hyundairotem', 'k2전차'], sector: 'K2흑표전차/철도' },
  { name: 'LIG넥스원', code: '079550', market: 'KOSPI', aliases: ['lignex1', '천궁'], sector: '정밀유도무기/미사일' },
  { name: '한국항공우주', code: '047810', market: 'KOSPI', aliases: ['kai', '카이', 'kf21', '수리온'], sector: '전투기/헬기항공' },
  { name: '한화시스템', code: '272210', market: 'KOSPI', aliases: ['hanwhasystems', '레이다'], sector: 'AESA레이다/방산IT' },
  { name: '풍산', code: '103140', market: 'KOSPI', aliases: ['poongsan', '탄약'], sector: '탄약/신동' },
  { name: 'HD현대중공업', code: '329180', market: 'KOSPI', aliases: ['hd중공업'], sector: '조선/특수선/엔진' },
  { name: '한화오션', code: '042660', market: 'KOSPI', aliases: ['대우조선해양', 'hanwhaocean'], sector: '잠수함/LNG선' },
  { name: '삼성중공업', code: '010140', market: 'KOSPI', aliases: ['samsungheavy', 'flng'], sector: '조선/해양플랜트' },
  { name: 'HD현대미포', code: '010620', market: 'KOSPI', aliases: ['현대미포조선'], sector: '석유화학제품운반선' },
  { name: 'HD한국조선해양', code: '009540', market: 'KOSPI', aliases: ['ksoe'], sector: '조선지주' },

  // ── [자동차 / 부품 / 모빌리티] ──
  { name: '현대차', code: '005380', market: 'KOSPI', aliases: ['hyundai', '현대자동차'], sector: '완성차/친환경차' },
  { name: '기아', code: '000270', market: 'KOSPI', aliases: ['kia', '기아차'], sector: '완성차/PBV' },
  { name: '현대모비스', code: '012330', market: 'KOSPI', aliases: ['mobis'], sector: '핵심부품/자율주행' },
  { name: '현대위아', code: '011210', market: 'KOSPI', aliases: ['wia'], sector: '열관리/샤시' },
  { name: 'HL만도', code: '204320', market: 'KOSPI', aliases: ['mando', '만도'], sector: '샤시/ADAS' },
  { name: '에스엘', code: '005850', market: 'KOSPI', aliases: ['sl'], sector: '차량용램프' },
  { name: '화신', code: '010690', market: 'KOSPI', aliases: ['hwashin'], sector: '샤시/바디' },
  { name: '서연이화', code: '200880', market: 'KOSPI', aliases: ['seoyone-hwa'], sector: '자동차내장재' },

  // ── [로봇 / 인공지능 / 소프트웨어] ──
  { name: '레인보우로보틱스', code: '277810', market: 'KOSDAQ', aliases: ['rainbowrobotics', '협동로봇', '휴보'], sector: '협동로봇/보행로봇' },
  { name: '두산로보틱스', code: '454910', market: 'KOSPI', aliases: ['doosanrobotics'], sector: '협동로봇' },
  { name: '로보티즈', code: '103520', market: 'KOSDAQ', aliases: ['robotis', '액추에이터'], sector: '자율주행배송로봇' },
  { name: '뉴로메카', code: '348340', market: 'KOSDAQ', aliases: ['neuromeka'], sector: '협동로봇/스마트팩토리' },
  { name: '유진로봇', code: '056080', market: 'KOSDAQ', aliases: ['yujinrobot'], sector: '자율주행물류로봇' },
  { name: '현대오토에버', code: '307950', market: 'KOSPI', aliases: ['autoever'], sector: '차량용소프트웨어' },
  { name: 'NAVER', code: '035420', market: 'KOSPI', aliases: ['네이버', 'naver', '클로바'], sector: '포털/검색/생성AI' },
  { name: '카카오', code: '035720', market: 'KOSPI', aliases: ['kakao', '카톡'], sector: '메신저/플랫폼' },
  { name: '크래프톤', code: '259960', market: 'KOSPI', aliases: ['krafton', '배그', '배틀그라운드'], sector: '글로벌게임IP' },
  { name: '넷마블', code: '251270', market: 'KOSPI', aliases: ['netmarble'], sector: '모바일게임' },
  { name: '엔씨소프트', code: '036570', market: 'KOSPI', aliases: ['ncsoft', '리니지'], sector: 'MMORPG게임' },
  { name: '펄어비스', code: '263750', market: 'KOSDAQ', aliases: ['pearlabyss', '붉은사막'], sector: '게임' },
  { name: '위메이드', code: '112040', market: 'KOSDAQ', aliases: ['wemade', '미르'], sector: '블록체인게임' },
  { name: 'SOOP', code: '067160', market: 'KOSDAQ', aliases: ['아프리카TV', '숲', 'soop'], sector: '라이브스트리밍' },
  { name: '폴라리스오피스', code: '041020', market: 'KOSDAQ', aliases: ['polaris'], sector: '오피스SW/AI' },
  { name: '코난테크놀로지', code: '402030', market: 'KOSDAQ', aliases: ['konan'], sector: 'AI음성/LLM' },
  { name: '마음AI', code: '377480', market: 'KOSDAQ', aliases: ['maumai'], sector: 'AI파운데이션' },
  { name: '플리토', code: '300080', market: 'KOSDAQ', aliases: ['flitto', '말뭉치'], sector: 'AI언어데이터' },

  // ── [소비재 / K-푸드 / K-뷰티 / 엔터] ──
  { name: '삼양식품', code: '003230', market: 'KOSPI', aliases: ['불닭', '불닭볶음면', 'samyang'], sector: 'K-라면/해외수출' },
  { name: '농심', code: '004370', market: 'KOSPI', aliases: ['nongshim', '신라면'], sector: '라면/스낵' },
  { name: '오리온', code: '271560', market: 'KOSPI', aliases: ['orion', '초코파이'], sector: '제과/글로벌수출' },
  { name: 'CJ제일제당', code: '097950', market: 'KOSPI', aliases: ['bibigo', '비비고'], sector: '식품/바이오소재' },
  { name: '빙그레', code: '005180', market: 'KOSPI', aliases: ['binggrae', '바나나맛우유'], sector: '빙과/유음료' },
  { name: '실리콘투', code: '257720', market: 'KOSDAQ', aliases: ['silicon2', 'K뷰티', '역직구'], sector: '글로벌화장품유통' },
  { name: '에이피알', code: '278470', market: 'KOSPI', aliases: ['apr', '메디큐브', '부스터프로'], sector: '뷰티디바이스/화장품' },
  { name: '아모레퍼시픽', code: '090430', market: 'KOSPI', aliases: ['amorepacific', '코스알엑스'], sector: '화장품' },
  { name: '한국콜마', code: '161890', market: 'KOSPI', aliases: ['kolmar'], sector: '화장품ODM/썬케어' },
  { name: '코스맥스', code: '192820', market: 'KOSPI', aliases: ['cosmax'], sector: '화장품ODM' },
  { name: '마녀공장', code: '439090', market: 'KOSDAQ', aliases: ['manyo', '클렌징오일'], sector: '클린뷰티화장품' },
  { name: '브이티', code: '018290', market: 'KOSDAQ', aliases: ['vt', '리들샷'], sector: '마이크로니들화장품' },
  { name: '하이브', code: '352820', market: 'KOSPI', aliases: ['hybe', 'bts', '방탄', '뉴진스'], sector: '글로벌엔터/위버스' },
  { name: 'JYP Ent.', code: '035900', market: 'KOSDAQ', aliases: ['jyp', '제이와이피', '스트레이키즈'], sector: '엔터테인먼트' },
  { name: '에스엠', code: '041510', market: 'KOSDAQ', aliases: ['sm', '에스엠엔터', '에스파'], sector: '엔터테인먼트' },
  { name: '와이지엔터테인먼트', code: '122870', market: 'KOSDAQ', aliases: ['yg', '블랙핑크', '베이비몬스터'], sector: '엔터테인먼트' },

  // ── [금융 / 밸류업 지주사] ──
  { name: 'KB금융', code: '105560', market: 'KOSPI', aliases: ['kb국민은행', 'kbfg'], sector: '종합금융지주' },
  { name: '신한지주', code: '055550', market: 'KOSPI', aliases: ['신한은행', 'shinhan'], sector: '종합금융지주' },
  { name: '하나금융지주', code: '086790', market: 'KOSPI', aliases: ['하나은행', 'hana'], sector: '종합금융지주' },
  { name: '우리금융지주', code: '316140', market: 'KOSPI', aliases: ['우리은행', 'woori'], sector: '종합금융지주' },
  { name: '메리츠금융지주', code: '138040', market: 'KOSPI', aliases: ['meritz', '메리츠'], sector: '주주환원/금융지주' },
  { name: '카카오뱅크', code: '323410', market: 'KOSPI', aliases: ['kakaobank'], sector: '인터넷전문은행' },
  { name: '삼성생명', code: '032830', market: 'KOSPI', aliases: ['samsunglife'], sector: '생명보험' },
  { name: '삼성화재', code: '000810', market: 'KOSPI', aliases: ['samsungfire'], sector: '손해보험' },
  { name: '삼성물산', code: '028260', market: 'KOSPI', aliases: ['samsungc&t'], sector: '지주/건설/상사' },
  { name: '고려아연', code: '010130', market: 'KOSPI', aliases: ['koreazinc', '영풍'], sector: '비철금속/아연/은' },
  { name: 'SK스퀘어', code: '402340', market: 'KOSPI', aliases: ['sksquare'], sector: 'ICT투자전문' },

  // ── [글로벌 대표 테크] ──
  { name: '엔비디아', code: 'NVDA', market: 'NASDAQ', aliases: ['nvidia'], sector: 'AI 가속기/GPU' },
  { name: '테슬라', code: 'TSLA', market: 'NASDAQ', aliases: ['tesla'], sector: '전기차/로보택시' },
  { name: '애플', code: 'AAPL', market: 'NASDAQ', aliases: ['apple'], sector: '스마트폰/IT' },
  { name: '마이크로소프트', code: 'MSFT', market: 'NASDAQ', aliases: ['microsoft', 'ms'], sector: '클라우드/OS' },
  { name: '알파벳', code: 'GOOGL', market: 'NASDAQ', aliases: ['구글', 'google', 'alphabet'], sector: '검색/AI' },
  { name: '아마존', code: 'AMZN', market: 'NASDAQ', aliases: ['amazon'], sector: '이커머스/AWS' },
  { name: '메타', code: 'META', market: 'NASDAQ', aliases: ['meta', '페이스북'], sector: 'SNS/AI' },
  { name: '브로드컴', code: 'AVGO', market: 'NASDAQ', aliases: ['broadcom'], sector: '통신반도체' },
  { name: 'TSMC', code: 'TSM', market: 'NYSE', aliases: ['tsmc'], sector: '파운드리' },
  { name: 'ASML', code: 'ASML', market: 'NASDAQ', aliases: ['asml'], sector: '노광장비' },
];

/**
 * Enhanced search stock function:
 * Matches stock name, code, alias, and calculates match relevance score
 */
export function searchStock(query: string): StockMasterItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: { stock: StockMasterItem; score: number }[] = [];

  for (const stock of POPULAR_STOCKS) {
    const sName = stock.name.toLowerCase();
    const sCode = stock.code.toLowerCase();
    const aliases = stock.aliases?.map((a) => a.toLowerCase()) || [];

    let score = 0;

    if (sName === q || sCode === q) {
      score = 100; // Perfect match
    } else if (aliases.includes(q)) {
      score = 95; // Exact alias match
    } else if (sName.startsWith(q)) {
      score = 80; // Name prefix
    } else if (sCode.startsWith(q)) {
      score = 75; // Code prefix
    } else if (sName.includes(q)) {
      score = 60; // Name substring
    } else if (sCode.includes(q)) {
      score = 50; // Code substring
    } else if (aliases.some((a) => a.includes(q) || q.includes(a))) {
      score = 40; // Alias substring
    }

    if (score > 0) {
      results.push({ stock, score });
    }
  }

  // Sort by highest score first
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 8).map((r) => r.stock);
}

/**
 * Returns best single match for instant live preview card
 */
export function getBestStockMatch(query: string): StockMasterItem | null {
  const list = searchStock(query);
  return list.length > 0 ? list[0] : null;
}

