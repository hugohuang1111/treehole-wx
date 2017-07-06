//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    words:[{
      nickName: 'User1',
      word: '这里有报料'
    }, {
      nickName: 'User2',
      word: '这里有情绪'
    }, {
      nickName: 'User3',
      word: '这里有情绪'
    }, {
      nickName: 'User4',
      word: '这里有情绪'
    }, {
      nickName: 'User5',
      word: '这里有情绪'
    }, {
      nickName: 'User6',
      word: '这里有情绪'
    }, {
      nickName: 'User7',
      word: '这里有情绪'
    }, {
      nickName: 'User8',
      word: '这里有情绪'
    }, {
      nickName: 'User9',
      word: '这里有情绪'
    }, {
      nickName: 'User0',
      word: '这里有情绪'
    }, {
      nickName: 'User2',
      word: '这里有情绪'
    }],
    pendingWord:{},
    userInfo: {},
    toast: ''
  },
  //事件处理函数
  onConfirm: function(e) {
    console.log(e);
    this.setData({
      pendingWord: {
        nickName: this.data.userInfo.nickName,
        word: e.detail.value
      }
    });

    this.postWordIf()
  },
  onTitle: function() {
    this.fetchTopWord();
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo,
        pendingWord:{
          nickName: userInfo.nickName
        }
      })
      console.log(userInfo);
    });
    this.fetchTopWord()
  },

  fetchTopWord: function() {
    return
    const that = this;
    wx.request({
      url: 'http://127.0.0.1:8000/api/topexpress',
      data: {
        start: 0,
        length: 10
      },
      success: function (res) {
        if (200 != res.statusCode) {
          console.log('fetch data failed:' + res.errMsg);
          that.hint(res.errMsg);
          return
        }
        const words = []
        const resData = res.data
        if ('undefined' == typeof resData.words || null == resData.words) {
          return
        }
        console.log(resData.words);
        for (let i = 0; i < resData.words.length; i++) {
          // words.push(`{resData.words[i].nickName}:{resData.words[i].word}`)
          words.push({
            nickName: resData.words[i].nickName,
            word: resData.words[i].word
          })
        }
        that.setData({
          words: words
        });
        console.log(words)
        console.log(that.data.words)
      },
      fail: function (res) {
        console.log('failed' + res)
      }
    });
  },  
  postWordIf: function() {
    this.postWord(this.data.pendingWord);
  },

  postWord: function(info) {
    console.log(info);
    const that = this;
    wx.request({
      url: 'http://127.0.0.1:8000/api/express',
      data: {
        nickName: info.nickName,
        word: info.word},
      success: function (res) {
        if (200 != res.statusCode) {
          that.hint(res.errMsg);
          return
        }
        if (res.data.error) {
          that.hint(res.data.description);
          return
        }
      },
      fail: function (res) {
        that.hint(res.errMsg);
      }
    });
  },

  hint: function(t) {
    this.setData({
      toast: t
    })
  }
})
