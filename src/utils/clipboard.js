import Vue from 'vue'
import Clipboard from 'clipboard'

// 使用方法：
// <el-button @click='handleCopy(inputData,$event)'>copy</el-button>
// import clip from '~/utils/clipboard' // use clipboard directly

// methods: {
//   handleCopy(text, event) {
//     clip(text, event)
//   }
// }


function clipboardSuccess() {
  Vue.prototype.$message({
    showClose: true,
    message: '复制成功',
    type: 'success'
  });
}

function clipboardError() {
  Vue.prototype.$message({
    showClose: true,
    message: '复制失败',
    type: 'error'
  });
}

export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
