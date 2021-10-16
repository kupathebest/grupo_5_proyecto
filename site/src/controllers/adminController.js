const fs = require('fs');
const path = require('path');

const toThousand = require('../utils/toThousand');

const db = require('../database/models');
const { Op } = require('sequelize');

const { validationResult } = require('express-validator');

module.exports = {
    index: (req, res) => {

        db.Product.findAll({
            include: ['category', 'images', 'colour', 'mainFeature', 'display', 'camera', 'net', 'connectivity', 'battery']
        })
            .then(celulares => {
                return res.render('admin/index', {
                    celulares,
                    toThousand
                })
            })
            .catch(error => console.log(error))
    },
    add: (req, res) => {
        let categories = db.Category.findAll()
        let colours = db.Colour.findAll()
        Promise.all([categories, colours])
            .then((
                [
                    categories, colours
                ]
            ) => {
                return res.render('admin/productAdd', { categories, colours })
            })


    }
    ,
    agregar: (req, res) => {
        let errors = validationResult(req);

        if (req.fileValidationError) {
            let image = {
                param: 'image',
                msg: req.fileValidationError,
            }
            errors.errores.push(image)
        }

        if (errors.isEmpty()) {
            const { shortName, longName, brand, price, category, displayP, processorP, memoryP, storageP, expansionP, cameraP, batteryP, osP, profileP, weightP, colour, twog, threeg, fourg, fiveg, gprs, edge, sim, displayType, displaySize, displayResolution, density, protection, mainCamera, videoCamera, frontCamera, wifi, bluetooth, gps, usb, nfc, infrared, fastCharge, wirelessCharge } = req.body;
            db.MainFeature.create(
                {

                }
            )
            db.Product.create(
                {
                    shortName: shortName.trim(),
                    longName: longName.trim(),
                    brand: brand.trim(),
                    price: +price,
                    category: category.trim(),
                    colour: colour.trim(),
                    edge: edge.trim(),
                    displayP: displayP.trim(),
                    processorP: processorP.trim(),
                    memoryP: memoryP.trim(),
                    storageP: storageP.trim(),
                    expansionP: expansionP.trim(),
                    cameraP: cameraP.trim(),
                    batteryP: batteryP.trim(),
                    osP: osP.trim(),
                    profileP: profileP.trim(),
                    weightP: weightP.trim(),
                    twog: twog.trim(),
                    threeg: threeg.trim(),
                    fourg: fourg.trim(),
                    fiveg: fiveg.trim(),
                    gprs: gprs.trim(),
                    sim: sim.trim(),
                    mainCamera: mainCamera.trim(),
                    videoCamera: videoCamera.trim(),
                    frontCamera: frontCamera.trim(),
                    fastCharge: fastCharge.trim(),
                    wirelessCharge: wirelessCharge.trim(),
                    wifi: wifi.trim(),
                    bluetooth: bluetooth.trim(),
                    gps: gps.trim(),
                    usb: usb.trim(),
                    nfc: nfc.trim(),
                    infrared: infrared.trim(),
                    displayType: displayType.trim(),
                    displaySize: displaySize.trim(),
                    displayResolution: displayResolution.trim(),
                    density: density.trim(),
                    protection: protection.trim()
                }
            )
                .then(product => {
                    console.log(product);
                    if (req.files.length != 0) {
                        let images = req.files.map(image => {
                            let item = {
                                file: image.filename,
                                productId: product.id
                            }
                            return item
                        })

                        db.Image.bulkCreate(images)
                            .then(() => console.log('imagenes guardadas satisfactoriamente'))
                    }

                    return res.redirect('/admin')
                })
                .catch(error => console.log(error))


        }
        else {
            let categories = db.Category.findAll()
            let colours = db.Colour.findAll()
            Promise.all([categories, colours])
                .then((
                    [
                        categories, colours
                    ]
                ) => {
                    return res.render('admin/productAdd',
                        {
                            categories,
                            colours,
                            errores: errors.mapped(),
                            old: req.body
                        })

                })

        };
    },
    edit: (req, res) => {
        let categories = db.Category.findAll();
        let colours = db.Colour.findAll();
        let mobile = db.Product.findByPk(req.params.id, {
            include: ['category', 'images', 'colour', 'mainFeature', 'display', 'camera', 'net', 'connectivity', 'battery']
        })
        Promise.all(([categories, colours, mobile]))
            .then(([categories, colours, mobile]) => {
                return res.render('admin/productEdit', {
                    categories,
                    colours,
                    mobile
                })
            })
            .catch(error => console.log(error))

    },
    update: (req, res) => {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            let { shortName, longName, brand, price, category, displayP, processorP, memoryP, storageP, expansionP, cameraP, batteryP, osP, profileP, weightP, colour, twoG, threeG, fourG, fiveG, gprs, edge, sim, displayType, displaySize, displayResolution, density, protection, rearCamera, videoCamera, frontalCamera, wifi, bluethoot, gps, usb, nfc, infrared, fastCharge, wirelessCharge } = req.body;

            db.Product.findByPk(req.params.id, {
                include: ['category', 'images', 'colour', 'mainFeature', 'display', 'camera', 'net', 'connectivity', 'battery']
            })
                .then(celular => {
                    let mainFeature = db.MainFeature.update({
                        displayP,
                        processorP,
                        memoryP,
                        storageP,
                        expansionP,
                        cameraP,
                        batteryP,
                        osP,
                        profileP,
                        weightP
                    },
                        {
                            where: {
                                id: celular.mainFeatureId
                            }
                        })
                    let display = db.Display.update({
                        displayType,
                        displaySize,
                        displayResolution,
                        density,
                        protection
                    },
                        {
                            where: {
                                id: celular.displayId
                            }
                        })
                    let net = db.Net.update({
                        twoG,
                        threeG,
                        fourG,
                        fiveG,
                        gprs,
                        sim
                    },
                        {
                            where: {
                                id: celular.netId
                            }
                        })
                    let camera = db.Camera.update({
                        rearCamera,
                        frontalCamera,
                        videoCamera
                    },
                        {
                            where: {
                                id: celular.cameraId
                            }
                        })
                    let connectivity = db.Connectivity.update({
                        wifi,
                        bluethoot,
                        gps,
                        usb,
                        nfc,
                        infrared
                    },
                        {
                            where: {
                                id: celular.connectivityId
                            }
                        })
                    let battery = db.Battery.update({
                        fastCharge,
                        wirelessCharge
                    },
                        {
                            where: {
                                id: celular.batteryId
                            }
                        })
                    Promise.all(([mainFeature, display, net, camera, connectivity, battery]))
                        .then(([mainFeature, display, net, camera, connectivity, battery]) => {
                            db.Product.update({
                                shortName,
                                longName,
                                brand,
                                price,
                                edge,
                                colourId: colour,
                                categoryId: category,
                                mainFeatureId: mainFeature.id,
                                displayId: display.id,
                                cameraId: camera.id,
                                netId: net.id,
                                connectivityId: connectivity.id,
                                batteryId: battery.id
                            },
                                {
                                    where: {
                                        id: req.params.id
                                    }
                                })
                        })
                        .then(response => {
                            console.log(response)
                            return res.redirect('/admin');
                        })

                })
                .catch(error => console.log(error))

        } else {
            let categories = db.Category.findAll();
            let colours = db.Colour.findAll();
            let mobile = db.Product.findByPk(req.params.id, {
                include: ['category', 'images', 'colour', 'mainFeature', 'display', 'camera', 'net', 'connectivity', 'battery']
            })
            Promise.all(([categories, colours, mobile]))
                .then(([categories, colours, mobile]) => {
                    return res.render('admin/productEdit', {
                        categories,
                        colours,
                        mobile,
                        errores: errors.mapped(),
                        old: req.body
                    })
                })
                .catch(error => console.log(error))
        }

    },
    destroy: (req, res) => {

        db.Product.destroy(
            {
                where: { id: req.params.id }
            }
        )
        res.redirect('/admin');
        db.Product.findByPk(req.params.id, {
            include: ['category', 'images', 'colour', 'mainFeature', 'display', 'camera', 'net', 'connectivity', 'battery']
        })
            .then(celulares => {
                celulares.images.forEach(image => {
                    if (fs.existsSync(path.join(__dirname, '../public/images', image.file))) {
                        fs.unlinkSync(path.join(__dirname, '../public/images', image.file))
                    }
                });
                db.Product.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                    .then(() => {
                        return res.redirect('/admin')
                    })
            })
            .catch(error => console.log(error))

    },
    search: (req, res) => {
        let busqueda = req.query.keywords.toLowerCase()
        db.Product.findAll({
            include: ['category', 'images', 'colour', 'mainFeature', 'display', 'camera', 'net', 'connectivity', 'battery'],
            where: {
                [Op.or]: [
                    {
                        shortName: {
                            [Op.substring]: busqueda
                        }
                    },
                    {
                        longName: {
                            [Op.substring]: busqueda
                        }
                    }
                ]
            }
        })
            .then(celulares => {
                return res.render('admin/resultsAdmin', {
                    celulares,
                    busqueda,
                    toThousand
                })
            })
            .catch(error => console.log(error))

    }

}