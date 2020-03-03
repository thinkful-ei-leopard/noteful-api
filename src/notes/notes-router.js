const path = require('path')
const express = require('express')
const xss = require('xss')
const NoteService = require('./notes-service')


const noteRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
    id: note.id,
    name: xss(note.name),
    modified: note.modified,
    content: xss(note.content),
    date_created: note.date_created,
    folderid: note.folderid
})


noteRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('knexInstance')

        NoteService.getAllNotes(knexInstance)
            .then(notes => {
                res.json(notes.map(serializeNote))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('knexInstance')
        const newNote = { name: req.body.name, content: req.body.content, folderid: req.body.folderid }

        NoteService.insertNote(knexInstance, newNote)
            .then(note => {
                res.status(201).location(path.posix.join(req.originalUrl + `/${note.id}`)).json(serializeNote(note))
            })
            .catch(next)
    })



    noteRouter
        .route('/:id')
        .all((req, res, next) => {
            NoteService.getById(
                req.app.get('knexInstance'),
                req.params.id
            )
            .then(note => {
                if(!note) {
                    return res.status(404).json({
                        error: { message: `note does not exist` }
                    })
                }
                res.note = note
                next()
            })
            .catch(next)
        })
        .get((req, res, next) => {
            res.json(serializeNote(res.note))
        })
        .delete((req, res, next) => {
            NoteService.deleteNote(
                req.app.get('knexInstance'),
                req.params.id
            )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
        })
        .patch(jsonParser, (req, res, next) => {
            const noteToUpdate = { name: req.body.name, content: req.body.content}

            NoteService.patchNote(
                req.app.get('knexInstance'),
                req.params.id,
                noteToUpdate
            )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
        })






module.exports = noteRouter