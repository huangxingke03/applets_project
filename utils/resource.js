/**
 * 获取患者民族
 */
function getNationalityArray() {
  var nationalityArray = ['汉族',
    '蒙古族',
    '回族',
    '藏族',
    '维吾尔族',
    '苗族',
    '彝族',
    '壮族',
    '布依族',
    '朝鲜族',
    '满族',
    '侗族',
    '瑶族',
    '白族',
    '土家族',
    '哈尼族',
    '哈萨克族',
    '傣族',
    '黎族',
    '傈僳族',
    '佤族',
    '畲族',
    '高山族',
    '拉祜族',
    '水族',
    '东乡族',
    '纳西族',
    '景颇族',
    '柯尔克孜族',
    '土族',
    '达斡尔族',
    '仫佬族',
    '羌族',
    '布朗族',
    '撒拉族',
    '毛难族',
    '仡佬族',
    '锡伯族',
    '阿昌族',
    '普米族',
    '塔吉克族',
    '怒族',
    '乌孜别克族',
    '俄罗斯族',
    '鄂温克族',
    '崩龙族',
    '保安族',
    '裕固族',
    '京族',
    '塔塔尔族',
    '独龙族',
    '鄂伦春族',
    '赫哲族',
    '门巴族',
    '珞巴族',
    '基诺族'
  ]
  return nationalityArray;
}
var getLogisticsStatus={

    "1":"未发货",
    "2":"配送中",
    "3":"已送达",
    "4":"已取消"
  }


var getDeliGoodTypeObj={
    "1":"中草药",
    "2":"中药颗粒剂",
    "3":"中药代煎",
    "4":"浓缩汤剂",
    "5":"膏方",
    "6":"药品",
    "7":"商品"

  
}

var getAllDelivery={
    BEST: "百世快递" , 
    EMS: "中国邮政速递物流" ,
    OTP: "承诺达特快" , 
    PJ: "品骏物流" , 
    SF: "顺丰速运" , 
    YTO: "圆通速递" ,
    YUNDA: "韵达快递" ,
    ZTO: "中通快递"
  
}
var getDeliveryStatus = {
  "50": "已揽件"
  ,"30":"已装车"
  ,"31":"运送中"
  ,"130":"快件到达顺丰站"
  ,"123":"快件正送往顺丰站"
  ,"607":"代理收件"
  ,"44":"请准备签收"
  ,"80":"已签收"
  ,"70":"派送未成功"
  ,"33":"派件异常"
  ,"99":"转寄中"
  ,"648":"已退回/转寄"
}
var results={
  "0": "气虚质",
  "1": "气滞质",
  "2": "阳亢质",
  "3": "阳虚质",
  "4": "血虚质",
  "5": "血瘀质",
  "6": "痰湿质",
  "7": "湿热质",
  "8": "阴虚",
  "9": "平和质",

}
var resultsDetail=[
{
      title: '气虚质',
      model: 'A型',
      characteristics: '元气不足，以疲乏、气短、自汗等气虚表现为主要特征',
      performance: '平素语音低弱，气短懒言，容易疲乏，精神不振，易出汗，舌淡红，舌边有齿痕，脉弱。',
      heartCharacteristics: '性格内向，不喜冒险',
      diseaseTendency: '易患感冒、内脏下垂等病；病后康复缓慢',
      adaptiveCapacity: '易患感冒、内脏下垂等病；病后康复缓慢',
      defendantDescription: '肌肉松软不实',
    },
{
      title: '气滞质',
      model: 'B型',
      characteristics: '气机郁滞，以神情抑郁、忧虑脆弱等气郁表现为主要特征',
      performance: '神情抑郁，情感脆弱，烦闷不乐，舌淡红，苔薄白，脉弦',
      heartCharacteristics: '性格内向不稳定、敏感多虑',
      diseaseTendency: '易患脏躁、梅核气、百合病及郁证、失眠、抑郁症、神经官能症等',
      adaptiveCapacity: '对精神刺激适应能力较差；不适应阴雨天气',
      defendantDescription: '形体瘦者为多',
    },
 {
      title: '阳亢质',
      model: 'C型',
      characteristics: '怕热，手足心常热，性子急为主要特征',
      performance: '壮热、口干喜冷饮，大便秘结，小便短赤，舌红脉洪数',
      heartCharacteristics: '暂无具体详细信息',
      diseaseTendency: '暂无具体详细信息',
      adaptiveCapacity: '暂无具体详细信息',
      defendantDescription: '暂无具体详细信息',
    },
 {
      title: '阳虚质',
      model: 'D型',
      characteristics: '阳气不足，以畏寒怕冷、手足不温等虚寒表现为主要特征',
      performance: '平素畏冷，手足不温，喜热饮食，精神不振，舌淡胖嫩，脉沉迟',
      heartCharacteristics: '性格多沉静、内向',
      diseaseTendency: '易患痰饮、肿胀、泄泻等病；感邪易从寒化',
      adaptiveCapacity: '耐夏不耐冬；易感风、寒、湿邪',
      defendantDescription: '肌肉松软不实',
    },
{
      title: '血虚质',
      model: 'E型',
      characteristics: '神气不足，倦怠，面色惨白无光，常见贫血指标为主要特征',
      performance: '面色萎黄，眩晕，心悸，失眠，脉虚细',
      heartCharacteristics: '暂无具体详细信息',
      diseaseTendency: '暂无具体详细信息',
      adaptiveCapacity: '暂无具体详细信息',
      defendantDescription: '暂无具体详细信息',
    },
 {
      title: '瘀血质',
      model: 'F型',
      characteristics: '血行不畅，以肤色晦黯、舌质紫黯等血瘀表现为主要特征',
      performance:
        '肤色晦黯，色素沉着，容易出现瘀斑，口唇黯淡，舌黯或有瘀点，舌下络脉紫黯或增粗，脉涩。',
      heartCharacteristics: '易烦，健忘',
      diseaseTendency: '易患癥瘕及痛证、血证等',
      adaptiveCapacity: '不耐受寒邪',
      defendantDescription: '胖瘦均见',
    },
{
      title: '痰湿质',
      model: 'G型',
      characteristics: '痰湿凝聚，以形体肥胖、腹部肥满、口黏苔腻等痰湿表现为主要特征',
      performance: '面部皮肤油脂较多，多汗且黏，胸闷，痰多，口黏腻或甜，喜食肥甘甜黏，苔腻，脉滑',
      heartCharacteristics: '性格偏温和、稳重，多善于忍耐',
      diseaseTendency: '易患消渴、中风、胸痹等病',
      adaptiveCapacity: '对梅雨季节及湿重环境适应能力差',
      defendantDescription: '体形肥胖，腹部肥满松软',
    },
{
      title: '湿热质',
      model: 'H型',
      characteristics: '湿热内蕴，以面垢油光、口苦、苔黄腻等湿热表现为主要特征',
      performance:
        '面垢油光，易生痤疮，口苦口干，身重困倦，大便黏滞不畅或燥结，小便短黄，男性易阴囊潮湿，女性易带下增多，舌质偏红，苔黄腻，脉滑数',
      heartCharacteristics: '性情急躁、容易发怒；适应能力：不能耐受湿热环境',
      diseaseTendency: '湿热体质的人易患疮疖、黄疸、火热病等征',
      adaptiveCapacity: '湿热体质的人对湿环境或气温偏高，尤其夏末秋初，湿热交蒸气候较难适应',
      defendantDescription: '湿热体质的人形体偏胖或苍瘦',
    },
{
      title: '阴虚质',
      model: 'I型',
      characteristics: '阴液亏少，以口燥咽干、手足心热等虚热表现为主要特征',
      performance: '手足心热，口燥咽干，鼻微干，喜冷饮，大便干燥，舌红少津，脉细数',
      heartCharacteristics: '性情急躁，外向好动，活泼',
      diseaseTendency: '易患虚劳、失精、不寐等病；感邪易从热化',
      adaptiveCapacity: '耐冬不耐夏；不耐受暑、热、燥邪',
      defendantDescription: '体形偏瘦',
    },
{
      title: '平和质',
      model: 'J型',
      characteristics: '阴阳气血调和，以体态适中、面色红润、精力充沛等为主要特征',
      performance:
        '面色、肤色润泽，头发稠密有光泽，目光有神，鼻色明润，嗅觉通利，唇色红润，不易疲劳，精力充沛，耐受寒热，睡眠良好，胃纳佳，二便正常，舌色淡红，苔薄白，脉和缓有力。',
      heartCharacteristics: '性格随和开朗', // 心里特征
      diseaseTendency: '平素患病较少', // 病发倾向
      adaptiveCapacity: '对自然环境和社会环境适应能力较强', // 适应能力
      defendantDescription: '体形匀称健壮', // 辩体描述
  },

]

module.exports = {
  getNationalityArray,
  getDeliGoodTypeObj,
  getLogisticsStatus,
  getAllDelivery,
  getDeliveryStatus,
  results,
  resultsDetail
}
