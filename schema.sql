  
DROP TABLE IF EXISTS books;


CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    image VARCHAR (255),
    title VARCHAR (255),
    authors VARCHAR (255),
    description Text,
    bookshelf VARCHAR(255)

);

INSERT INTO books (image, title, authors, description, bookshelf) 
VALUES('http://books.google.com/books/content?id=Ca21d8dTAnoC&printsec=frontcover&img=1&zoom=1&edge=capi','Amman','Ahmad','dfgvjhkjlmdfyguiop','tradition');url&source=gbs_