var groupAnagrams = function(strs) {
    let result = [[]]
    let anaHash = {}
    for (let i = 0; i < strs.length; i ++) {
        let ana = strs[i].split("").sort().join("")
        console.log(strs[i])
        let idx = anaHash[ana]
        if (idx) {
            result[idx].push(strs[i])
            continue
        }
        anaHash[ana] = result.length
        result.push([strs[i]])
    }
    result.shift()
    return result
};

var productExceptSelf = function(nums) {
  let numZeroes = 0
  nums.forEach(num => {
    if (num === 0) {
      numZeroes++
    }
  })

  //two zeroes
  if (numZeroes >= 2) {
    let result = new Array(nums.length)
    result.fill(0)
    return result
  }

  let product = nums.reduce((acc, cur) =>  {
    if (cur === 0) {
      return acc
    }
    acc = acc * cur
    return acc
  }, 1)

  if (numZeroes === 1) {
    return nums.map(num => {
      if (num === 0) {
        return product
      }
      return 0
    })
  }
  
  //zero zeroes
  return nums.map(num =>  {
    return product * Math.pow(num, -1)
  })
};

var isValidSudoku = function(board) {
  //rows
  for (let i = 0; i < board.length; i++) {
    if (!isValidRow(board[i])) {
      return false
    }
  }

  //columns

  for (let j = 0; j < board.length; j ++) {
    let col = []
    for (let i = j; i < board.length; i++) {
      col.push(board[i][j])
    }
    
    if (!isValidRow(col)) {
      return false
    }
  }


  //boxes
  for (let k = 0; k <= 6; k += 3) {
    for (let l = 0; l <= 6; l += 3) {
      let box = []
      for (let i = k; i < k + 3; i ++) {
        let row = []
        for (let j = l; j < l + 3; j ++) {
          row.push(board[i][j])
        }
        box.push(row)       
      }
      box = box.flat()
      if (!isValidRow(box)) {
        return false
      }
    }
  }
 

    return true
};

var isValidRow = function(arr) {
  let memory = {}
  let numbers = {"1": true, "2": true, "3": true, "4": true,
                  "5": true, "6": true, "7": true, "8": true, "9": true}
  for (let i = 0; i < arr.length; i ++) {
    if (numbers[arr[i]]) {
      if (memory[arr[i]]) {
        return false
      }
      memory[arr[i]] = true
    }
  }

  return true
}

var generateBoxes = function(board) {
  for (let k = 0; k <= 6; k += 3) {
    for (let l = 0; l <= 6; l += 3) {
      let box = []
      for (let i = k; i < k + 3; i ++) {
        let row = []
        for (let j = l; j < l + 3; j ++) {
          //console.log([i, j])
          row.push(board[i][j])
          //console.log(box.length)
        }
        box.push(row)       
      }
      box = box.flat()
      if (!isValidRow(box)) {
        return false
      }
    }
  }
}

var generateColumns = function(board) {
  for (let j = 0; j < board.length; j++) {
    let col = []
    for (let i = 0; i < board.length; i++) {
      col.push(board[i][j])
      console.log([i, j])
    }
    //console.log(col)
    // if (!isValidRow(col)) {
    //   return false
    // }
  }
}

var topKFrequent = function(nums, k) {
  let hash = nums.reduce((acc, cur) => {
      acc[cur] ? acc[cur][1]++ : acc[cur] = [cur, 1]
      return acc
  }, {})
  
  let vals = Object.values(hash)
  let sortedVals = vals.sort((a, b) => b[1] - a[1])
  
  let valsTruncated = sortedVals.slice(0, k)

  let result = []
  valsTruncated.forEach(val => {
    result.push(val[0])
  })
  return result
};

console.log(topKFrequent([1,1,2,2,2,3,3,3,3], 2))