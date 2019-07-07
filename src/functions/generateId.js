const generateId = length => {

    // array of all available characters
    let chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','u','p','r','s','t','u','v','w','x','y','z','1','2','3',
                '4','5','6','7','8','9','-','_','-','_','-','_','-','_','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','U','P','R','S',
                'T','U','V','W','X','Y','Z'];
    
    // variable storing the concatenated characters
    let id = '';
    
    for(let i = 0;i<length;i++){
      let index = Math.floor(Math.random()*chars.length);
      id = `${id}${chars[index]}`;
    }
    return id;
}
module.exports = generateId;