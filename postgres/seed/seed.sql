BEGIN TRANSACTION;

INSERT into users(name, email, entries, joined) values ('Brady', 'brady@gmail.com', 5, '2022-01-01' );
INSERT into login(hash, email) values('$2a$10$WAK21U0LWl7C//jJ.DOB2uPP1DJQh7KUDgasdyQeGzkop2Pzl8W7u', 'brady@gmail.com')

COMMIT;