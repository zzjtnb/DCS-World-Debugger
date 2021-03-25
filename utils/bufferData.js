const bufferRead = function (buff) {
  var offset = 0;
  return {
    readInt8: function () {
      var int8 = buff.readInt8(offset);
      offset += 1;
      return int8;
    },

    readInt16: function () {
      var int16 = buff.readInt16LE(offset);
      offset += 2;
      return int16;
    },

    readInt32: function () {
      var int32 = buff.readInt32LE(offset);
      offset += 4;
      return int32;
    },

    readString: function (len) {
      var str = buff.toString("utf8", offset, offset + len);
      offset += len;
      return str;
    }
  };
}


const bufferWrite = function (socket) {
  return {
    writeInt8: function (int8) {
      var buff = Buffer.alloc(1);
      buff.writeInt8(int8, 0);
      socket.write(buff);
    },

    writeInt16: function (int16) {
      var buff = Buffer.alloc(2);
      buff.writeInt16LE(int16, 0);
      socket.write(buff);
    },

    writeInt32: function (int32) {
      var buff = Buffer.alloc(4);
      buff.writeInt32LE(int32, 0);
      socket.write(buff);
    },

    writeString: function (str) {
      socket.write(str);
    },

    /**
     * fmt is format string
     * A  : string
     * b  : byte (unsigned char)
     * h  : short
     * i  : int
     */
    write: function (fmt) {
      for (var i = 0; i < fmt.length; i++) {
        switch (fmt.charAt(i)) {
          case 'A':
            this.writeString(arguments[i + 1]);
            break;

          case 'b':
            this.writeInt8(arguments[i + 1]);
            break;

          case 'h':
            this.writeInt16(arguments[i + 1]);
            break;

          case 'i':
            this.writeInt32(arguments[i + 1]);
            break;
        }
      }
    }
  };
}



module.exports = {
  bufferRead,
  bufferWrite
}
