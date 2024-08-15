
const data = [ 
    [
        'body',
        'consequatur omnis est praesentium\n' +
        'ducimus non iste\n' +
        'neque hic deserunt\n' +
        'voluptatibus veniam cum et rerum sed',
        'title',
        'sapiente omnis fugit eos',
        'id',
        '88',
        'userId',
        '9'
    ],
    [
        'body',
        'consequatur omnis est praesentium\n' +
        'ducimus non iste\n' +
        'neque hic deserunt\n' +
        'voluptatibus veniam cum et rerum sed',
        'title',
        'sapiente omnis fugit eos',
        'id',
        '88',
        'userId',
        '9'
    ] 
]

function retrofit(arr) {
    let ret = []
    for (let i=0; i<arr.length; i++ ) {
        const element = arr[i]
        let obj = {}
        for (let j=0; j<element.length; j+=2 ) {
            const key = element[j]
            const value = element[j+1]
            if (key === 'id' || key === 'userId') 
                obj[key] = parseInt(value, 10)
            else
                obj[key] = value
                
        }
        ret.push(obj)
    }
    return ret
}

console.log(retrofit(data))

// for (let i=0; i<data.length; i++ ) {
//     const post = data[i]
//     let obj = {}
//     console.log(post)
//     for (let j=0; j<post.length; j+=2) {
//         const key = post[j]
//         const value = post[j+1]
//         obj[key] = value
//     }
//     console.log(obj)
// }

// import { load, findAllEx } from './daos/impl/redis/scripts/findAll_script.js'
// load()
// const result = await findAllEx()
// console.log(result)