const path = require('path')
const express = require('express')
const xss = require('xss')
const FolderService = require('./folders-service')


const folderRouter = express.Router()
const jsonParser = express.json()


folderRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('knexInstance')

        FolderService.getAllFolders(knexInstance)
            .then(folders => {
                res.json(folders)
            })

            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const newFolder = { name: req.body.name }

        FolderService.insertFolder(req.app.get('knexInstance'), newFolder)
            .then(folder => {
                res.status(201).location(path.posix.join(req.originalUrl + `/${folder.id}`)).json(folder)
            })
            .catch(next)
    })




    folderRouter
        .route('/:id')
        .all((req, res, next) => {
            FolderService.getById(req.app.get('knexInstance'), req.params.id)
            .then(folder => {
                if(!folder) {
                    return res.status(404).json({
                        error: { message: `folder doesn't exist`}
                    })
                }
                res.folder = folder
                next()
            })

            .catch(next)
        })
        .get((req, res, next) => {
            res.json({
                id: res.folder.id,
                name: xss(res.folder.name),
                date_created: res.folder.date_created
            })
        })
        .delete((req, res, next) => {
            const knexInstance = req.app.get('knexInstance')
    
            FolderService.deleteFolder(knexInstance, req.params.id)
                .then(folder => {
                    if(!folder) {
                        return res.status(404).json({
                            error: { message: `folder doesn't exist` }
                        })
                    }
                    res.status(204).end()
                })
                .catch(next)
        })
        .patch(jsonParser, (req, res, next) => {
            const folderToUpdate = {name: req.body.name}

            FolderService.updateFolder(
                req.app.get('knexInstance'),
                req.params.id,
                folderToUpdate
            )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
        })





module.exports = folderRouter