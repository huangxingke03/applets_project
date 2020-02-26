Component({
  properties:{
    desc:{
      type:String,
      value:""
    },
    title:{
      type:String,
      value:""
    },
      num: {
      type: String,
      value: ""
    },
    thumb:{
      type:String,
      value:""
    }
  },
  data: {
    imgUrls: [
      'http://www.baimg.com/uploadfile/2015/0210/BTW_2015021076846.jpg',
      'http://static.html580.com/upload/image/2012/11/3494.jpg',
    ],
    indicatorDots:true,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
  methods:{
  
  
  }
})
