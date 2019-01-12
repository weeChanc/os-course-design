class File {
  path: '/'
  type: File.file
  childFile: null
  childDir: null

  constructor(path, type) {
    this.path = path;
    if (!type) type = File.file;
    this.type = type;
  }

  newFile(fileName) {
    if (this.childFile == null) this.childFile = []
    this.childFile.push(new File(this.path + fileName))
  }

  newDir(dirName) {
    if (this.childDir == null) this.childDir = []
    this.childDir.push(new File(this.path + fileName + "/"),File.dir)
  }


}

File.dir = 1;
File.file = 0;
export default new File()
