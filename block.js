class Block {
  constructor (timeStamp, lastHash, hash, data) {
    this.timeStamp = timeStamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
  }

  toString() {
    return `Block --
      Time Stamp: ${this.timeStamp}
      Last Hash: ${this.lastHash.substring(0, 10)}
      Hash     : ${this.hash.substring(0, 10)}
      Data     : ${this.data}
    `
  }
}

module.exports = Block