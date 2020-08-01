const Video = require('../models/Video');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async function (req,res) {
    try {
        const { categoryId } = req.query;

        const videos = await Video.find({category: categoryId});
            // .toArray();

        res.status(200).json(videos)
    } catch(e) {
        errorHandler(res,e)
    }
};

module.exports.create = async function (req,res) {
    try {
        const video = await new Video({
            title: req.body.title,
            url: req.body.url,
            description: req.body.description,
            duration: req.body.duration,
            tumbnail_url: req.body.tumbnail_url,
            tags: req.body.tags,
            channelTitle: req.body.channelTitle,
            category: req.body.categoryId,
        }).save();

        res.status(201).json(video)
    } catch(e) {
        errorHandler(res,e)
    }
};

module.exports.update = async function (req,res) {
    try {
        const video = await Video.findOneAndUpdate({
            _id: req.params.id
        },{
            $set: req.body
        },{
            new: true
        });
        res.status(200).json(video);
    }catch (e){
        errorHandler(res,e);
    }
};

module.exports.download = async function (req, res) {
    try {
        console.log("req.params.id", req.params.id)
        const fs = require('fs');
        const youtubedl = require('youtube-dl');
        const Buffer = require('buffer').Buffer;
        
        const video = youtubedl(`https://www.youtube.com/watch?v=${req.params.id}`,
            // Optional arguments passed to youtube-dl.
            ['--format=18'], // --encoding  'ext=base64
            // Additional options can be given for calling `child_process.execFile()`.
            { cwd: __dirname });
        
        // Will be called when the download starts.
        video.on('info', function(info) {
            console.log('Download started')
            console.log('filename: ' + info._filename)
            console.log('size: ' + info.size)
        })
        
        video.pipe(fs.createWriteStream('assets/myvideo.mp4'));
        // var fileBuffer = Buffer.from('assets/myvideo.mp4', 'base64');
        // console.log('fileBuffer', fileBuffer)

        video.on('complete', function complete(info) {
            'use strict'
            console.log('filename: ' + info._filename + ' already downloaded.')
        })
           
        video.on('end', function() {
            res.download(`assets/myvideo.mp4`);
            res.on('end', function end(res){
                console.log("res finisheddddddd", res)
                res.status(200).json(res)
            })
        })
    }catch (e) {
        errorHandler(res,e)
    }
}

module.exports.readVideo = async function(req, res) {
    // const path = 'assets/myvideo.mp4'
    // const stat = fs.statSync(path)
    // const fileSize = stat.size
    // const range = req.headers.range
    // if (range) {
    //   const parts = range.replace(/bytes=/, "").split("-")
    //   const start = parseInt(parts[0], 10)
    //   const end = parts[1] 
    //     ? parseInt(parts[1], 10)
    //     : fileSize-1
    //   const chunksize = (end-start)+1
    //   const file = fs.createReadStream(path, {start, end})
    //   const head = {
    //     'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    //     'Accept-Ranges': 'bytes',
    //     'Content-Length': chunksize,
    //     'Content-Type': 'video/mp4',
    //   }
    //   res.writeHead(206, head);
    //   file.pipe(res);

      
    // } else {
    //   const head = {
    //     'Content-Length': fileSize,
    //     'Content-Type': 'video/mp4',
    //   }
    //   res.writeHead(200, head)
    //   fs.createReadStream(path).pipe(res)
    // }
    var fs = require('fs');
        const file = `assets/myvideo.mp4`;
    try {
        res.download(file)
    } catch (e) {
        errorHandler(res, e)
    } finally {
        // fs.unlink(file);
        fs.unlinkSync(file)
    }
  };