const canvas = document.getElementById('chart')
const ctx = canvas.getContext('2d')

function drawLine (start, end, style) {
  ctx.beginPath()
  ctx.strokeStyle = style || 'black'
  ctx.moveTo(...start)
  ctx.lineTo(...end)
  ctx.stroke()
}

function drawTriangle (apex1, apex2, apex3) {
  ctx.beginPath()
  ctx.moveTo(...apex1)
  ctx.lineTo(...apex2)
  ctx.lineTo(...apex3)
  ctx.fill()
}

function fetchAvailableStocks() {
  fetch('http://localhost:5500/stocks')
    .then(response => response.json())
    .then(data => {
      console.log('Available stocks:', data.stockSymbols)
    })
    .catch(error => {
      console.error('Error fetching stocks:', error)
    })
}

function fetchStockData() {
  const spinner = document.querySelector('.spinner')

  fetch('http://localhost:5500/stocks')
    .then(response => response.json())
    .then(data => {
      const stockSymbols = data.stockSymbols

      const promises = stockSymbols.map((stockSymbol, index) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            fetch(`http://localhost:5500/stocks/${stockSymbol}`)
              .then(response => response.json())
              .then(stockData => {
                console.log(`Details for ${stockSymbol}:`, stockData)
                resolve()
              })
              .catch(error => {
                console.error(`Error fetching details for ${stockSymbol}:`, error)
                reject(error)
              })
          }, index * 100)
        })
      )

      Promise.allSettled(promises)
        .then(() => {
          spinner.style.display = 'none'
        })
        .catch(error => {
          console.error('Error fetching stocks:', error)
        })
    })
    .catch(error => {
      console.error('Error fetching stocks:', error)
    })
}

fetchAvailableStocks()
fetchStockData()

drawLine([50, 50], [50, 550])
drawTriangle([35, 50], [65, 50], [50, 35])

drawLine([50, 550], [950, 550])
drawTriangle([950, 535], [950, 565], [965, 550])
