Lehe praegune aadress: harlog.era.ee
(Server on ebastabiilne ja võib sattuda, et on vahel maas)





1. Tuleb hankida vajalikud failid:
	harlog frontend public fail - https://github.com/Tyks23/harlog-public-
	harlog backend fail - https://github.com/Tyks23/harlog-backend

2. Tuleb paigaldada vajalikud tarkvarad:
	Node.js
	PostgreSQL

3. Tuleb andemebaas seadistada:
	1)Sisenedes psql konsooli, mis tuleb kaasa PostgreSQL installeerimisega.
	2)Sisestada käsklused psql konsoolid andmebaasi ehitamiseks, mis on harlog backend README.md failis "Andmebaasi koostamine:" sektsioonis.
	
4. Harlog backend 'db.js' failis tuleb seadistada õiged PostgreSQL omadused, mis on vastavalt serveriga.

5. Harlog backendis 'app.js' failis tuleb leida 'app.use()' meetod, ja selle sisuks tulle määrata harlog frontendist saadud 'public' folderi path  
Näiteks: app.use("/", express.static("/home/kasutajakonto/Desktop/harlog/public"));

6. Tuleb kinnitada, et vajalikud serveri portid on lahti, või back endis olevad portid vahetada vajalikele portidele 'app.liste()' meetodis.

7. Tuleb navigeerida enda valitud käsureal(näiteks cmd) harlog backendi serveri kausta, ning sisestada käsk 'npm install'.

Sellega on server seadistatud.

Et serverit käivitada tuleb navigeerida käsureal(näiteks cmd) harlog backendis olevasse server kausta, ning sisestada käsk 'node app.js'.
