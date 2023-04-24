const express = require('express');
const db = require('./connection');


const app = express();
//Static Folder
app.use(express.static('public'));
//EJS
app.set('view engine', 'ejs');

//How many posts we want to show on each page
const resultsPerPage = 12;

app.get('/', (req, res) => {
    var pageables = [];
    let search = req.query.search ? req.query.search : "";
    let sql = "SELECT a.*, b.categoria FROM ecommerce.producto a inner join ecommerce.categoria b on b.idCategoria=a.idCategoria where (CASE WHEN '" + search + "' = '' THEN 1 ELSE (CASE WHEN concat(a.producto, ' ', a.descripcion) like '%" + search + "%' THEN 1 ELSE 0 END) END) = 1 order by a.idproducto asc ";
    console.log(sql);


    db.query(sql, (err, result) => {
        if(err) throw err;
        const numOfResults = result.length;

        if(numOfResults>0){
            const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            let page = req.query.page ? Number(req.query.page) : 1;
            if(page > numberOfPages){
                res.redirect('/?page='+encodeURIComponent(numberOfPages));
            }else if(page <= 0){
                res.redirect('/?page='+encodeURIComponent('1'));
            }
            //Determine the SQL LIMIT starting number
            const startingLimit = (page-1) * resultsPerPage;
            //Get the relevant number of POSTS for this starting page
            sql = "SELECT a.*, b.categoria FROM ecommerce.producto a inner join ecommerce.categoria b on b.idCategoria=a.idCategoria where (CASE WHEN '" + search + "' = '' THEN 1 ELSE (CASE WHEN concat(a.producto, ' ', a.descripcion) like '%" + search + "%' THEN 1 ELSE 0 END) END) = 1 order by a.idproducto asc LIMIT " + startingLimit + "," + resultsPerPage;
            console.log(sql);
            db.query(sql, (err, result)=>{
                if(err) throw err;
                let iterator = (page - 5) < 1 ? 0 : page - 5;
                let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                if(endingLink < (page + 4)){
                    iterator -= (page + 4) - numberOfPages;
                }

                pageables = {
                    "content" : result,
                    "empty" : (page>=0)? false : true,
                    "first" : (page==0)? true : false,
                    "last" : (page>=numberOfPages)? true : false,
                    "iterator" : iterator,
                    "number" : page-1,
                    "totalPages" : numberOfPages,
                    "numberOfElements" : numberOfPages,
                    "size" : numberOfPages,
                    "totalElements" : numOfResults
                };


                //res.render('index', {data: result, page, iterator, endingLink, numberOfPages});
                //pageables.push({"content" : result});
                //pageables.push({"iterator" : iterator});
                //pageables.push({"page" : page});
                //pageables.push({"endingLink" : endingLink});
                //pageables.push({"numberOfPages" : numberOfPages});
                //pageables.push({"numOfResults" : numOfResults});
                //pageables["iterator"] = iterator;
                //pageables.page = page;
                //pageables.endingLink = endingLink;
                //pageables.numberOfPages = numberOfPages;
                console.log(pageables);
                
                res.status(200).json(pageables)
            });

        }else{
            pageables = {
                "content" : null,
                "empty" : true,
                "first" : false,
                "last" : true,
                "iterator" : 0,
                "number" : 0,
                "totalPages" : 0,
                "numberOfElements" : 0,
                "size" : 0,
                "totalElements" : 0
            };
            res.status(200).json(pageables)
        }


    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server has started on PORT 3000');
});