var cloudinary = require('cloudinary')

console.log(process.env.CLOUDINARY_CLOUD_NAME)

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

var repository = {}

var getImages = function (folder) {

    return new Promise(resolve => {

        var images = repository[folder]
        if (images && repository[folder].expire > new Date()) {
            resolve(images)
        } else {
            cloudinary.v2.search
                .expression('folder:' + folder)
                .with_field('tags')
                .max_results(50)
                .execute().then(result => {
                    var data = result.resources.map(resource => {
                        var image = resource.url
                        if(resource.tags && resource.tags.length > 0) {
                            var res = {
                                src: image
                            }
                            resource.tags.forEach(tag => {
                                if(tag.includes('http')) {
                                    res.href = tag
                                } else {
                                    res.description = tag
                                }
                            })
                            return res
                        } else {
                            return image
                        }
                    })
                    repository[folder] = {
                        "expire": new Date(),
                        "data": data
                    }
                    resolve(repository[folder].data)
                }).catch(err => console.error(err));
        }
    })

}


module.exports = getImages