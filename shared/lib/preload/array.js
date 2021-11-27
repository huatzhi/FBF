Object.defineProperties(Array.prototype,{
    count: {
        value: function(query) {
            let count = 0;
            for (let i = 0; i < this.length; i++) {
                if (this[i] === query){
                    count++;
                }
            }
            return count;
        }
    }
})