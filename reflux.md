### Reflux 

Create employee table: 
```
CREATE TABLE albertoi/employee (
    id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(40),
    birthday decimal(8, 0) default 19000101,
    gender CHAR(1) default 'M', 
    updatedAt TIMESTAMP, 
    createdAt TIMESTAMP default current timestamp
)
```

Journal employee table: 
```
STRJRNPF FILE(ALBERTOI/EMPLOYEE) JRN(ALBERTOI/MYJRN) IMAGES(*BOTH) OMTJRNE(*OPNCLO)
```

Insert employee via Terminal: 
```
insert into albertoi/employee (name, birthday, gender) values('alberto', 19661223, 'M')
insert into albertoi/employee (name, birthday, gender) values('容志強', 19661223, 'M')
```

Insert employee via DBVisualizer: 
```
insert into albertoi.employee (name, birthday, gender) values('berto', 19791223, 'M')
insert into albertoi.employee (name, birthday, gender) values('小志強', 19791223, 'M')
```

Insert employee via SQL Developer: 
```
select * from albertoi.employee@as400.ih; 

insert into albertoi.employee@as400.ih (name, birthday, gender) values('bertinho', 19991223, 'M')
insert into albertoi.employee@as400.ih (name, birthday, gender) values('小小強', 19991223, 'M')
```

Create reflux table: 
```
CREATE TABLE albertoi/reflux (
    id INT GENERATED ALWAYS AS IDENTITY,
    content VARCHAR(1024),
    completed CHAR(6) default 'false',     
    updatedAt TIMESTAMP, 
    createdAt TIMESTAMP default current timestamp
)
```

Journal reflux table: 
```
STRJRNPF FILE(ALBERTOI/REFLUX) JRN(ALBERTOI/MYJRN) IMAGES(*BOTH) OMTJRNE(*OPNCLO)
```

Create triggr function: 
```
CREATE TRIGGER albertoi/reflux_processor
AFTER INSERT ON reflux
REFERENCING NEW AS new_row
FOR EACH ROW
BEGIN
    DECLARE SQL_STATEMENT_STATUS INT;
    BEGIN
        DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
                SET SQL_STATEMENT_STATUS = -1;
        EXECUTE IMMEDIATE new_row.content; 
        IF SQL_STATEMENT_STATUS = -1 THEN
            UPDATE reflux set updatedAt = current timestamp, completed = 'failed' 
            WHERE id = new_row.id;
        ELSE
            UPDATE reflux set updatedAt = current timestamp, completed = 'true' 
            WHERE id = new_row.id;
        END IF;
    END;
END
```

Insert reflux table via Terminal:
```
insert into albertoi/reflux (content) values('insert into albertoi.employee(name, birthday, gender) values(''alberto'', 19661223, ''M'') ')
```

Insert reflux via DBVisualizer: 
```
insert into albertoi.reflux (content) values('insert into albertoi.employee(name, birthday, gender) values(''Berto'', 19791223, ''M'') ')
```

Insert reflux via SQL Developer: 
```
insert into albertoi.reflux@as400.ih (content) values('insert into albertoi.employee(name, birthday, gender) values(''Bertinho'', 19991223, ''M'') ')

insert into albertoi.reflux@as400.ih (content) values('update albertoi.employee set name=''Perdinho'' where id=9 ')

insert into albertoi.reflux@as400.ih (content) values('update albertoi.employee set birthday='''' where id=9 ')


```








```
CREATE TABLE albertoi/employee (
    id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(40),
    birthday decimal(8, 0) default 0,
    gender CHAR(1) default 'M', 
    createdAt TIMESTAMP default current timestamp
)

CREATE TABLE albertoi/reflux (
    id INT GENERATED ALWAYS AS IDENTITY,
    content VARCHAR(1024),
    completed CHAR(5) default 'false', 
    updatedAt TIMESTAMP, 
    createdAt TIMESTAMP default current timestamp
)
```

```
STRJRNPF FILE(ALBERTOI/REFLUX) JRN(ALBERTOI/MYJRN) IMAGES(*BOTH) OMTJRNE(*OPNCLO)
STRJRNPF FILE(ALBERTOI/EMPLOYEE) JRN(ALBERTOI/MYJRN) IMAGES(*BOTH) OMTJRNE(*OPNCLO)
```

```
insert into albertoi/employee (name, birthday, gender) values('alberto', 19661223, 'M')
```

```
select * from albertoi.reflux@as400.ih; 

insert into albertoi.reflux@as400.ih (content) values('insert into albertoi.employee(name, birthday, gender) values(''alberto'', 19661223, ''M'') ');
insert into albertoi.reflux@as400.ih (content) values('insert into albertoi.employee(name, birthday, gender) values(''bertinho'', 20240902, ''M'') ');

insert into albertoi.reflux@as400.ih (content) values('insert into albertoi.employee(name, birthday, gender) values(''小志強'', 20240902, ''M'') ');
insert into albertoi.reflux@as400.ih (content) values('update albertoi.employee set name=albertoi.ucs2tobig5(''小志強'') where id=7 ');
```

```
CREATE TRIGGER albertoi/reflux_processor
AFTER INSERT ON reflux
REFERENCING NEW AS new_row
FOR EACH ROW
BEGIN
    DECLARE SQLCODE INTEGER;
    DECLARE SQLSTATE CHAR(5);

    EXECUTE IMMEDIATE new_row.content; 
    UPDATE reflux set updatedAt = current timestamp, 
           completed = 'true' 
    WHERE id = new_row.id;
END
```

```
create function dcdevdta/big5toucs2(big5string char(256) CCSID 1377)
returns vargraphic(256) CCSID 1200          
LANGUAGE SQL
CONTAINS SQL
EXTERNAL ACTION
DETERMINISTIC
return cast(big5string as vargraphic(256) ccsid 1200)


create function dcdevdta/ucs2tobig5(ucs2string graphic(40) CCSID 1200)
returns char(80) CCSID 1377
LANGUAGE SQL
CONTAINS SQL
EXTERNAL ACTION
DETERMINISTIC
return cast(ucs2string as char(80) ccsid 1377)
```

### EOF (2024/09/06)