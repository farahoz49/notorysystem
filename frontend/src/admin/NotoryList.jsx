// src/pages/NotoryList.jsx
import React, { useEffect, useMemo, useState } from "react";

const NOTARIES  = [
    { id: 1, name: "Asad Maxamed Maxamuud Wehliye", notaryName: "Aayatiin", district: "Hoden Dabaqa TCC", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 2, name: "Axmed Yuusuf Abtidoon", notaryName: "Abtidoon", district: "Warta-Nabada Labbo Dhagax", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 3, name: "Cabdikariim Xasan Nuur Maxamed", notaryName: "Aflax", district: "Dayniile Aargadda Raadayrka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 4, name: "Bashiir Macalim Maxamed Ibraahim", notaryName: "Afrax", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 5, name: "Cabdiqaadir Xasan Faarax", notaryName: "Al Cadaala", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 6, name: "Yaasiin Axmed Cusmaan", notaryName: "Al-Aamin", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 7, name: "Bashiir Siyaad Maxamed", notaryName: "Albashiir", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 8, name: "Maxamed Xaaji Shiikhey Abati", notaryName: "Alfaqi", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 9, name: "Cabdiwali Xasan Culusow Cali", notaryName: "Al-faraj", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 10, name: "Maxamuud Bile Cabdi", notaryName: "Al-islaam", district: "Wadajir Isgoyska KM4", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 11, name: "Maxamed Axmed Nuur", notaryName: "Alkowthar", district: "Warta-Nabadda Jidka Ja Da,ud", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 12, name: "Cabdulqaadir Cabdullaahi Maxamed", notaryName: "Alnuur", district: "Kaaraan Isgoyska Sanca", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 13, name: "Cismaan Cabdulle Cabdi Cisman (Jeelle)", notaryName: "Al-Taqwa", district: "Daaru-Salaam", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 14, name: "Cabdiraxman Sh Maxamed Xasan", notaryName: "Alxarameyn", district: "Gubadley", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 15, name: "Ahmed Hassan Osmaan", notaryName: "Aman", district: "Hoden KM4", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 16, name: "Maxamed Cabdulqaadir Sh. Xasan (Amiin)", notaryName: "Amiin", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 17, name: "Cabdullaahi Cabdi Xirsi Faarax", notaryName: "Asal", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 18, name: "Maxamed Salaad Xasan", notaryName: "Asiib", district: "Yaaqshid Suuqa Xoolaha", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 19, name: "Aweys Ibraahim Xuseen", notaryName: "Aweis", district: "Yaaqshid Towfiiq", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 20, name: "Cabdirashid Cabdullaahi Maxamed", notaryName: "Aw-Muuse", district: "Kaaraan Isgoyska Sanca", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 21, name: "Muxuyadiin Xasan Maxamed", notaryName: "Azhari", district: "Yaaqshid Towfiiq", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 22, name: "Abuubakar Muumin Axmed", notaryName: "Baana", district: "X/Weyne Kacaan Uunlaaye", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 23, name: "Cusmaan Xasan Cusmaan", notaryName: "Baari", district: "Kaaraan Suuq Kaaraan", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 24, name: "Cabdiqaadir Cabdi Axmed", notaryName: "Bakaal", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 25, name: "Maxamed Cabdullaahi Hagar Maxamuud", notaryName: "Balli", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 26, name: "Axmed Ciise Cabdullaahi", notaryName: "Banaadir A Ciise", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 27, name: "Yoonis Cabdiraxman Maxamud Cali", notaryName: "Banaadir Danuun", district: "Howlwadaag Shiirkole", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 28, name: "Cabdiraxman Maxamuud Cali (Time Cade)", notaryName: "Banaadir TimeCade", district: "Wadajir KM4 Jidka Airporka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 29, name: "Cabdiraxmaan Warsame Siyaad", notaryName: "Banaadir Warsame", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 30, name: "Cabdi Axmed Caseyr (Gaani)", notaryName: "Banaadir-Gaani", district: "Wadajir KM4 Jidka Airporka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 31, name: "Cumar Faarax Axmed", notaryName: "Baraawe", district: "Cabdicasiis Marinaaya", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 32, name: "Maxamed Xasan Faarax", notaryName: "Barakaad", district: "Garasbaaley Tab. Sh Ibraahim", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 33, name: "Cabdiraxmaan Daahir Cabdi Booliis", notaryName: "Barako", district: "Wadajir Isgoyska Korontada", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 34, name: "Xasan Maxamed Cali Barrow", notaryName: "Barrow", district: "Yaaqshid Ex-Suuqa Xoolaha", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 35, name: "Xasan Maxamed Sh. Maxamed", notaryName: "Baryare", district: "Daaru-Salaam", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 36, name: "Maxamed Nuur Maxmed Cali", notaryName: "Baxnaan", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 37, name: "Muqtaar Macalim Cilmi Maxamed", notaryName: "Bayaan", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 38, name: "Xasan Aadan Ibraahim Maxamed", notaryName: "Bilaal", district: "Kaxda Shinbroole", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 39, name: "Abuubakar Maxamed Suufi Maxamed", notaryName: "Bisle", district: "Kaaraan Xaliima Hiite", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 40, name: "Maxamuud Cali Cumar", notaryName: "Biyey", district: "Kaaraan Isgoyska Sanca", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 41, name: "Cabdikariim Maxamed Biyow", notaryName: "Biyow", district: "Kaaraan Suuqa Dahabka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 42, name: "Cabaas Cabdullaahi Bootaan Sahal", notaryName: "Bootaan", district: "Kaxda Gnrl.Liiqliiqato", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 43, name: "Maxamed Cabdiraxmaan Sh. Maxamed", notaryName: "Boqole", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 44, name: "Cabdisalaan Cabdiraxmaan Caafi Cabdulle", notaryName: "Caafi", district: "Daaru-Salaam", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 45, name: "Cabdulqaadir Ibraahim Cali", notaryName: "Caalami", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 46, name: "Cabdiqadir Sheekh Cabdiwahab Maxamed", notaryName: "Cabdiwahaab", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 47, name: "Cabdishakuur Axmed Maxamed Maxamuud", notaryName: "Caddawe", district: "Hoden Cadaani Tower2 Makka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 48, name: "Cabdiraxmaan Cali Maxamed Hiraabe", notaryName: "Cali Hiraabe", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 49, name: "Cali Abuukar Xaayow", notaryName: "Cali Marduuf", district: "Cabdicasiis Waxda Lowyacade", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 50, name: "Faaduma Cali Abuukar", notaryName: "Cali Marduuf", district: "Cabdicasiis Waxda Lowyacade", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 51, name: "Cumar Cali Maxamuud Cawaale", notaryName: "Cali-Agoon", district: "Daaru-Salaam", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 52, name: "Aweys Yuusuf Caraale", notaryName: "Caraale", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 53, name: "Aadan Maxamed Carmo", notaryName: "Carmo", district: "Garasbaaley Tabl. Sh Ibraahim", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 54, name: "Maxamuud Maxamed Cali Cashara", notaryName: "Cashara", district: "Dharkeynley AJabka Madiina", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 55, name: "Xuseen Cali Maxamuud", notaryName: "Cawaale", district: "Daaru-Salaam", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 56, name: "Cabdullaahi Cumar Cabdi", notaryName: "Cilmi", district: "Waabari Jidka 21 Octoober", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 57, name: "Maxamed Axmed Ciyow", notaryName: "Ciyow", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 58, name: "Maxamed Cabdi Daahir Colaad", notaryName: "Colaad", district: "Waabari KM4 Jidka Airporka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 59, name: "Mustaf Cabdulle Cosoble", notaryName: "Cosoble", district: "Kaaraan Suuq Kaaraan", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 60, name: "Nuur Cali Culusow Geedi", notaryName: "Culusow", district: "Yaaqshid Isgoyska Siinaay", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 61, name: "Maxamed Dalmar Axmed", notaryName: "Dalmar", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 62, name: "Naciima Cali Barre", notaryName: "Dalsan", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 63, name: "Nuux Cabdullahi Cusmaan", notaryName: "Daryeel", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 64, name: "Aadan Jimcaale Maxamed", notaryName: "Dayax", district: "Howlwadaag Jidka Sodonka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 65, name: "Abuubakar Xuseen Maxamed", notaryName: "Dhagajuun", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 66, name: "Dhaqane Isxaaq Cabdi", notaryName: "Dhaqane", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 67, name: "Cabdinaasir Abuukar Xaaji Dheere", notaryName: "Dheere", district: "X/Weyne Ex-Shanem Super", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 68, name: "Nuur Maxamed Maxamuud", notaryName: "Dhooley", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 69, name: "Maxamed Ciise Dhowrane", notaryName: "Dhowrane", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 70, name: "Xasan Dhuxulow Xasan Raage", notaryName: "Dhuxulow", district: "Kaaraan Suuq Kaaraan", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 71, name: "Axmed Maxamuud Xuseen Diirshe", notaryName: "Diirshe", district: "Hoden Jidka Makka Almukrm", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 72, name: "Maxamed Nuur Maxamuud", notaryName: "Diiwaan", district: "Howlwadaag Sayidka Makka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 73, name: "Zakariye Abdullaahi Axmed", notaryName: "Dr. Zakariye", district: "Kaaraan Suuqa Kaaraan", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 74, name: "Cabduraxmaan Xaaji M. Ereg", notaryName: "Dr.Ereg", district: "Hoden Isgoyska Taleex", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 75, name: "Maxamed Maxamuud Ismaaciil", notaryName: "Duceysane", district: "Daaru-Salaam", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 76, name: "Shaafici Maxamed Axmed Cali", notaryName: "Dulqaad", district: "Waabari Isgoyska Taleex", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 77, name: "Daahir Maxamuud Maxamed", notaryName: "ENP Xamar", district: "Yaaqshid Ex-Control Balcad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 78, name: "Cabdi Cadaawe Cali", notaryName: "Ex-Banaadir", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 79, name: "Cumar Maxamed Faarax (Gomed)", notaryName: "Faaruuq", district: "Wadajir KM4 Jidka Airporka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 80, name: "Bilaal Xamsa Maxamed", notaryName: "Faaruuq", district: "Wadajir KM4 Jidka Airporka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 81, name: "Maxamuud Cabdi Macalin Abuukar", notaryName: "Fanax", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 82, name: "Salaad Cilmi Fiidow", notaryName: "Fiidow", district: "Hoden Isgoyska Taleex", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 83, name: "Maxamuud Maxamed Cabdi", notaryName: "Findhig", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 84, name: "Ciise Cabdirahman Maxamed", notaryName: "Fiqi", district: "Garasbaaley Zoone F.KM15", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 85, name: "Maxamed M.Maxamuud Cumar (Madoobe)", notaryName: "Gacaliye", district: "Hoden Haanta Dheer", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 86, name: "Saciid Cabdullaahi Axmed", notaryName: "Galac", district: "Xamarweyne City Mall", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 87, name: "Muuse Xasan Ibraahim", notaryName: "Galobal", district: "Hoden Jidka Makka-Shaqaalaha", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 88, name: "Cartan Cabdisalaam Calasow Dabey", notaryName: "Gardoon", district: "Hoden Jidka Tarbuunka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 89, name: "Ibraahim Maxamed Axmed", notaryName: "Garsoor", district: "Hoden Jidka Taleex", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 90, name: "Cabdi Axmed Cali (Geedi)", notaryName: "Geedi", district: "Hoden Madaxt.C/qasim", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 91, name: "Xalwo Maxamed Axmed", notaryName: "Gorgor", district: "Hoden Jidka Tarbuunka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 92, name: "Maxamed Cabdi Maxamed Xuseen", notaryName: "Gurmad", district: "Daaru-Salaam", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 93, name: "Xamza Maxamed Cabdullaahi", notaryName: "Guudle", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 94, name: "Guuleed Maxamuud Jimcaale Cismaan", notaryName: "Guuleed-Biil", district: "Hoden Zoone F.KM15", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 95, name: "Maxamuud Aadan Xaashi Jimcaale", notaryName: "Habarwaa", district: "Kaxda Shimbiroole", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 96, name: "Cabdiqaadir Salaad Maxamed", notaryName: "Haleel", district: "Dharkeenley Saldhiga Galbeed", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 97, name: "Cali Maxamed Cilmi", notaryName: "Harsan", district: "Yaaqshid Isgoyska Baar Ayaan", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 98, name: "Axmed Xasan Abuukar", notaryName: "Heegan", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 99, name: "Cabdirashiid Maxamuud Axmed", notaryName: "Hilaaf", district: "Howlwadaag Jidka Sodonka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 100, name: "Maxamed Sh Axmed Xasan", notaryName: "Hilaal", district: "Dharkeynley Macmacaanka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 101, name: "Ciise Maxamed Yuusuf", notaryName: "Himilo", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 102, name: "Aadan Cali Cadow", notaryName: "Hiraabe", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 103, name: "Cali Xaashi Cali Ugaas", notaryName: "Horseed", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 104, name: "Aweys Sheekh Cali Qaasim", notaryName: "Horyaal", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 105, name: "Ismaaciil Cali Axmed Mahad-Alle", notaryName: "Hubaal", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 106, name: "Aadan Cilmi Maxamed (Macalin Aadan)", notaryName: "Hubiye", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 107, name: "Aaden Cabdulqaadir Yaxye", notaryName: "Hufane", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 108, name: "Xuseen Maxamuud Muuse", notaryName: "If-ka", district: "Kaaraan Boosteejada", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 109, name: "Maxamed Xirsi Sheekhdoon", notaryName: "lleys", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 110, name: "Cali Sheekh Cabdi", notaryName: "Ilkadahab", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 111, name: "Maxamed Maxamuud Maxamed (Dr Luu)", notaryName: "Irmaan", district: "X/Weyne Kacaan Uunlaaye", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 112, name: "Xasan Axmed Cabdulle", notaryName: "Irshaad", district: "Hoden Zoobe KM5", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 113, name: "Abuukar Cabdulle Maxamed", notaryName: "Jaran", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 114, name: "Cabdullaahi Aadan Maxamuud", notaryName: "Kaafiye", district: "Dayniile SiisiiMasjid Muumino", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 115, name: "Maxamed Cabdullaahi Xuseen", notaryName: "Kaahiye", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 116, name: "Cabdifataax Axmed Cabdulle Kulan", notaryName: "Kaamil", district: "Daaru-Salaam", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 117, name: "Cabdifitaax Cumar Maxamed", notaryName: "Kaatib", district: "Waabari Xaaji Baasto", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 118, name: "Cabdulqaadir Cumar Kaatib", notaryName: "Kaatib", district: "Waabari Xaaji Baasto", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 119, name: "Yaxya Maxamuud Maxamed", notaryName: "Kaay-kaay", district: "Warta-Nabada Labbo Dhagax", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 120, name: "Haashim Maxamed Yusuf (Kabaqori)", notaryName: "Kabaqori", district: "Daaru-Salaam", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 121, name: "Xuseen Maxamed Kadiye", notaryName: "Kadiye", district: "Waabari Jidka 21 Octoober", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 122, name: "Cali Macalin Xasan Maxamuud", notaryName: "Kalsan", district: "Hoden Horjeedka Tree-Piano", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 123, name: "Bashiir Maxamed Sheekh Maxamed", notaryName: "Karaama", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 124, name: "Maxamed Sh. Axmed Khaliif", notaryName: "Khalifa", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 125, name: "Axmed Cartan Cali (Qaasim)", notaryName: "Khayraat", district: "Wadajir KM4 Jidka Airporka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 126, name: "Cabdinaasir Sh.Cali Jimcaale", notaryName: "Kheyre", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 127, name: "Cabdulwahaab Nuur Mahdi", notaryName: "Kulan", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 128, name: "Cabdirisaaq Xasan Cilmi", notaryName: "Kulmiye", district: "Howlwadaag Isg. Baar Ubax", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 129, name: "Liibaan Cusmaan Aadan", notaryName: "Liban", district: "Hoden Zoobe KM5", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 130, name: "Salaad Maxamed Jaamac", notaryName: "Macruuf", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 131, name: "Cabdullaahi Axmed Xirsi", notaryName: "Mahadale", district: "Yaaqshid Isgoyska Baar Ayaan", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 132, name: "Aweys Cismaan Xaaji Axmed", notaryName: "Mataanaha", district: "Wadajir Jidka Airporka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 133, name: "Xasan Nuur Maxamuud", notaryName: "Midnimo", district: "Kaaraan Suuq Kaaraan", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 134, name: "Muniira Cabdiqaadir Khadar", notaryName: "Miftaax", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 135, name: "Cumar Sh Axmed Ciise", notaryName: "Mubaarak", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 136, name: "Cabdi Aaden Macalin Cabdulle", notaryName: "Mucallim", district: "Warta-Nabada Jid. Mareexaan", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 137, name: "Xassan Sh. Maxamed Farxaan", notaryName: "Muq.Studio legale", district: "Yaaqshid 4ta Jerdiino", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 138, name: "Cabdi Cabdullaahi Abtidoon", notaryName: "Muqdisho Abtidon", district: "Howlwadaag Isg. Baar Ubax", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 139, name: "Maxamed Ibraahim Maxamed Cali", notaryName: "Muqdisho Maxamed", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 140, name: "Saciid Cali Cosoble", notaryName: "Muqdisho Saciid", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 141, name: "Maxamed Cali Nuur (Socdaal)", notaryName: "Muqdisho Socdaal", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 142, name: "Cabdullaahi Sh Daahir Xasan", notaryName: "Muqdisho Waana", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 143, name: "Feysal Maxamed Maxamuud", notaryName: "Mustaqbal", district: "X/Weyne Kacaan Uunlaaye", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 144, name: "Maxamed Muxuyadiin Caraale", notaryName: "Naafic", district: "Waabari Shaqaalaha Makka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 145, name: "Cabdifitaax Faarax Naaleeye", notaryName: "Naaleeye", district: "Waabari Jidka Liberia", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 146, name: "Xaydar Cali Odowaa Cosoble", notaryName: "Odowaa", district: "Dharkeynley AJabka Madiina", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 147, name: "Cismaan Maxamed Ismaaciil", notaryName: "Osmaan", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 148, name: "Burhaan Cabdullaahi Xuseen", notaryName: "Prime Notary", district: "Hoden Isgoyska Banaadir", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 149, name: "Kayse Saciid Cartan", notaryName: "Qaaddi", district: "Boondheere Wadada Jubba", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 150, name: "Cabdiraxmaan Maxamed Xasan", notaryName: "Qaanuuni", district: "Hoden Isgoyska Taleex", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 151, name: "Cabdullaahi Faarax Qaarey", notaryName: "Qaarey", district: "Wadajir KM4 Jidka Airporka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 152, name: "Qaasim Maxamed Ibrahim Barrow", notaryName: "Qaasimmi", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 153, name: "Cabdullaahi Xasan Wehliye", notaryName: "Qalam", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 154, name: "Maxamed Cabdi Axmed", notaryName: "Qaran", district: "Hoden Isgoyska Taleex", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 155, name: "Maxamuud Nuur Maxamed", notaryName: "Qoobeey", district: "Waabari Maajo Makka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 156, name: "Maxamed Aaden Sheekh Nuur", notaryName: "Qooje", district: "Hoden Jidka Tarbuunka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 157, name: "AxmedNuur Cabdi Warsame", notaryName: "Qoole", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 158, name: "Maxamed Aadan Qorane", notaryName: "Qorane", district: "Kaxda Gnrl.Liiqliiqato", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 159, name: "Muuse Macalim Maxamed", notaryName: "Raas", district: "Shangaani Madbacada Qaranka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 160, name: "Maxamed Cumar Ibraahim", notaryName: "Rasmi Muqdsiho", district: "Dharkeynley Macmacaanka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 161, name: "Muriidi Muumin Axmed", notaryName: "Rasmi Xamar", district: "X/Weyne Kacaan Uunlaaye", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 162, name: "Muumin Axmed Abubakar", notaryName: "Rasmi Xamar", district: "X/Weyne Kacaan Uunlaaye", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 163, name: "Ibraahim Daahir Xuseen", notaryName: "Rayaan", district: "Dharkeynley Macmacaanka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 164, name: "Yaasiin Cabdi Xasan", notaryName: "Rogaal", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 165, name: "Maxamed Diiriye Sabriye", notaryName: "Sabriye", district: "Waabari Maajo Makka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 166, name: "Cabdiraxim Ibraahim Macalin", notaryName: "Sadsoor", district: "Waabari Jidka Makka Almuk.", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 167, name: "Maxamed Cismaan Wehliye", notaryName: "Salaam", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 168, name: "Ismaacill Macalin Maxamuud Cali", notaryName: "Salaama", district: "Gubadley", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 169, name: "Xuseen Xasan Cabdulle", notaryName: "Salmaan", district: "Kaaraan Suuqa Karaan", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 170, name: "Cabdifataax Cabdisamad Cabdiraxmaan", notaryName: "Shaahid", district: "Xamarweyne Muqdisho Mall", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 171, name: "Ismaacil Maxamed Cabdullaahi", notaryName: "Shahaad", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 172, name: "Cumar Xasan Cilmi", notaryName: "Sham", district: "Wadajir KM4 Jidka Airporka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 173, name: "Cabdullaahi Sheekh Cali Salaad", notaryName: "Sheekh Cabdi", district: "Hoden Jidka Taleex", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 174, name: "Axmed Maxamed Axmed", notaryName: "Siliki", district: "Kaaraan Suuq Kaaraan", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 175, name: "Cabdiqaadir Cali Siyaad", notaryName: "Siyaad", district: "Hoden Jidka Tarbuunka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 176, name: "Cabdiraxmaan Xasan Cumar", notaryName: "Soomaaliya", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 177, name: "Cumar Cabdi Cadaawe", notaryName: "Suldaan", district: "Daaru-Salaam", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 178, name: "Xasan Maxamed Axmed (Sunni)", notaryName: "Sunni", district: "Hoden Zoobe KM5", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 179, name: "Xasan Maxamed Taajir", notaryName: "Taajir", district: "Yaaqshid Towfiiq", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 180, name: "Saciid Cali Maxamuud", notaryName: "Taakulo", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 181, name: "Faadumo Cusmaan Xaaji Ismaaciil", notaryName: "Tagsan", district: "Hoden Isgoyska Taleex", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 182, name: "Cusman Cumar Kaatib", notaryName: "Tahajid", district: "Hoden Zoobe KM5 Safaari", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 183, name: "Cali Xasan Cali Nuur", notaryName: "Talasan", district: "Cabdicasiis Waxda Lowyacade", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 184, name: "Maxamed Xuseen Xasan", notaryName: "Talawadaag M Xuse", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 185, name: "Sh Axmed Cali Cismaan", notaryName: "Talawadaag Sh Axm", district: "Waabari Isgoyska Dabka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 186, name: "Xusseen Maxamed Calasow", notaryName: "Tawakal", district: "Dharkeynley SuuqLiif", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 187, name: "Maxamed Cabdullahi Maxamed Siyaad", notaryName: "Tayo", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 188, name: "Cabdirisaaq Maxamed Cabdulle (Tiikey)", notaryName: "Tiikey", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 189, name: "Cabdiraxmaan Xuseen Maxamuud", notaryName: "Timo-weyne", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 190, name: "Ibrahim Xasan Sheekh Xuseen", notaryName: "Towfiiq", district: "Yaaqshid Towfiiq", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 191, name: "Yusuf Tuurxume Jimcaale", notaryName: "Tuurxume", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 192, name: "Cabdiraxmaan Nuur Tuuryare", notaryName: "Tuuryare", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 193, name: "Cabdi Axmed Cali Geedi", notaryName: "Ummadda", district: "Daaru-Salaam", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 194, name: "Idris Maxamed Cusmaan", notaryName: "Waabari", district: "Waabari Shaqaalaha Makka", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 195, name: "C\qaadir Maxamed Cosoble", notaryName: "Waasuge", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 196, name: "Idriis Cabdiraxmaan Maxamuud", notaryName: "Wadan", district: "Kaaraan Isgoyska Sanca", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 197, name: "Cabdullaahi Maxamed Siyaad (Gaab)", notaryName: "Wadani", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 198, name: "Abuubakar Yusuf Wardheere", notaryName: "Wardheere", district: "Yaaqshid Ex-Suuqa Xoolaha", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 199, name: "Cali Xaaji Maxamed Warsame", notaryName: "Warsame", district: "Hoden KM13", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 200, name: "Axmed Cabdiraxmaan Wehliye Maalin", notaryName: "Wehliye", district: "Waabari Jidka 21 Octoober", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 201, name: "Cali Xuseen Nuur", notaryName: "Weydow", district: "Kaxda Shimbiraale", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 202, name: "Safiyo Yuusuf Tuurxume", notaryName: "Xaaji Tuurxume", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 203, name: "Cabdixakiin Nuur Maxamed", notaryName: "Xaakim", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 204, name: "Cali Xasan Faarax", notaryName: "Xakiim", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 205, name: "Cabdirisaaq Mire Maxamed", notaryName: "Xalane", district: "Warta-Nabada labbo Dhagax", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 206, name: "Cali Yuusuf Xuseen", notaryName: "Xamar", district: "Howlwadaag Shiirkole", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 207, name: "Maxamed Yacquub Isaaq Aaden", notaryName: "Xamarcade", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 208, name: "Axmed Ismaaciil Barre (Madaxey)", notaryName: "Xaqdhowr", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 209, name: "Ibraahim lidle Suleymaan", notaryName: "Xaqdoon", district: "Wadajir Buulo Xuubey Himilo", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 210, name: "Xuseen Aaden Xasan Yaasiin", notaryName: "Xaydar", district: "Waabari Tree Piano", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 211, name: "Badrudiin Sheekh Rashiid Ibraahiim", notaryName: "Xijaaz", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 212, name: "Ciise Xaaji Cumar Yare", notaryName: "Yaroow Cigalle", district: "Warta-Nabada Jidka Wadnaha", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 213, name: "Cabdiraxmaan Axmed Cali", notaryName: "Zaahir", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 214, name: "Cabdulqaadir Cali Abkey", notaryName: "Abkey", district: "Xamarweyne City Mall", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 215, name: "Muuse Axmed", notaryName: "Eynab", district: "Hoden Jidka Taleex", region: "Banaadir", issueDate: "27 AUGUST 2025" },
    { id: 216, name: "Cabdullaahi Sh Ibraahim Aadan (Xaydar)", notaryName: "Arlaadi", district: "Baydhabo", region: "Baay", issueDate: "27 AUGUST 2025" },
    { id: 217, name: "Maxamuud Cabdi Yuusuf", notaryName: "Baydhabo", district: "Baydhabo", region: "Baay", issueDate: "27 AUGUST 2025" },
    { id: 218, name: "Maxamednuur Cabdiraxmaan Ibraahim", notaryName: "Danwadaag", district: "Baydhabo", region: "Baay", issueDate: "27 AUGUST 2025" },
    { id: 219, name: "Axmed Sheekh Nuur (Dr.Zaki)", notaryName: "Kulmis", district: "Baydhabo", region: "Baay", issueDate: "27 AUGUST 2025" },
    { id: 220, name: "Ibraahim Maxamed Cali", notaryName: "Manhal", district: "Baydhabo", region: "Baay", issueDate: "27 AUGUST 2025" },
    { id: 221, name: "Cabdirisaaq Yacquub Xasan", notaryName: "Marwaaz", district: "Baydhabo", region: "Baay", issueDate: "27 AUGUST 2025" },
    { id: 222, name: "Khadiijo Axmed Muudey", notaryName: "Muudey", district: "Baydhabo", region: "Baay", issueDate: "27 AUGUST 2025" },
    { id: 223, name: "Xuseen Isgoowe Xuseen (Xaqsoor)", notaryName: "Xaqsoor", district: "Baydhabo", region: "Baay", issueDate: "27 AUGUST 2025" },
    { id: 224, name: "Xuseen Maxamed Aadan", notaryName: "Dooy", district: "Baydhabo", region: "Baay", issueDate: "27 AUGUST 2025" },
    { id: 225, name: "Maxamed Mire Axmed", notaryName: "Boosaaso", district: "Boosaaso", region: "Barri", issueDate: "27 AUGUST 2025" },
    { id: 226, name: "Xasan Muuse Nuux", notaryName: "Karkaar", district: "Qardho", region: "Barri", issueDate: "27 AUGUST 2025" },
    { id: 227, name: "Cabdullaahi Saciid Cismaan", notaryName: "Saadaal", district: "Boosaaso", region: "Barri", issueDate: "27 AUGUST 2025" },
    { id: 228, name: "Cabdinaasir Maxamuud Xasan", notaryName: "Al-Hudaa", district: "Cabudwaaq", region: "Galgaduud", issueDate: "27 AUGUST 2025" },
    { id: 229, name: "Cabdullaahi Maxamaed Maxamuud", notaryName: "Bayaan Galmudug", district: "Dhuusamareeb", region: "Galgaduud", issueDate: "27 AUGUST 2025" },
    { id: 230, name: "Cabdi Abshir Nuure (Dalamr)", notaryName: "Daljir", district: "Dhuusamareeb", region: "Galgaduud", issueDate: "27 AUGUST 2025" },
    { id: 231, name: "Maxamed Nuur Diiriye", notaryName: "Dirie Notary", district: "Guriceel", region: "Galgaduud", issueDate: "27 AUGUST 2025" },
    { id: 232, name: "Cabdisamad Maxamed Samatar", notaryName: "Duulaay", district: "Guriceel", region: "Galgaduud", issueDate: "27 AUGUST 2025" },
    { id: 233, name: "Cabdigargaar Axmed Xaashi", notaryName: "Gargaar", district: "Cabudwaaq", region: "Galgaduud", issueDate: "27 AUGUST 2025" },
    { id: 234, name: "Axmed Nuur Xasan", notaryName: "Guriceel", district: "Guriceel", region: "Galgaduud", issueDate: "27 AUGUST 2025" },
    { id: 235, name: "Bashiir Xuseen Maxamed", notaryName: "Hanaano", district: "Dhuusamareeb", region: "Galgaduud", issueDate: "27 AUGUST 2025" },
    { id: 236, name: "Yoonis Axmed Maxamed", notaryName: "Jaameeye", district: "Cadaado", region: "Galgaduud", issueDate: "27 AUGUST 2025" },
    { id: 237, name: "Daahir Xasan Faarax", notaryName: "Januune", district: "Dhuusamareeb", region: "Galgaduud", issueDate: "27 AUGUST 2025" },
    { id: 238, name: "Cabdiraxmaan Maxamuud Maxamed", notaryName: "Kaamil", district: "Cadaado", region: "Galgaduud", issueDate: "27 AUGUST 2025" },
    { id: 239, name: "Mahad Maxamed Cabdi", notaryName: "Shaahid", district: "Cabudwaaq", region: "Galgaduud", issueDate: "27 AUGUST 2025" },
    { id: 240, name: "Cabdulaahi Daahir Cabdi", notaryName: "Sumcad", district: "Guriceel", region: "Galgaduud", issueDate: "27 AUGUST 2025" },
    { id: 241, name: "Dayib Aadam Maxamed", notaryName: "Taakulo Galmudug", district: "Dhuusamareeb", region: "Galgaduud", issueDate: "27 AUGUST 2025" },
    { id: 242, name: "Abaas Maxamuud Maxamed", notaryName: "Baxdo", district: "Baxdo", region: "Galgaduud", issueDate: "27 AUGUST 2025" },
    { id: 243, name: "Cabdi Maxamed Aadan", notaryName: "Luuq", district: "Luuq", region: "Geda", issueDate: "27 AUGUST 2025" },
    { id: 244, name: "Maxamed Bahdoon Takoy", notaryName: "Sahal", district: "Luuq", region: "Geda", issueDate: "27 AUGUST 2025" },
    { id: 245, name: "Aadan Maxamed Axmed (Afgooye)", notaryName: "Bile", district: "Baladxaawo", region: "Gedo", issueDate: "27 AUGUST 2025" },
    { id: 246, name: "Maxamed Xasan Ibraahim", notaryName: "Ganaane", district: "Luuq", region: "Gedo", issueDate: "27 AUGUST 2025" },
    { id: 247, name: "Maxamed Cusmaan Ibraahim", notaryName: "Caddaala", district: "Baladweyne", region: "Hiiraan", issueDate: "27 AUGUST 2025" },
    { id: 248, name: "Khaliif Maxamed Muxumed", notaryName: "Jalalaqsi", district: "Jalalaqsi", region: "Hiiraan", issueDate: "27 AUGUST 2025" },
    { id: 249, name: "Maxamed Yuusuf Cabdi", notaryName: "Jawiil", district: "Beledweyne-Jawiil", region: "Hiiraan", issueDate: "27 AUGUST 2025" },
    { id: 250, name: "Liibaan Cabdullaahi Muumin", notaryName: "Liibaan", district: "Baladweyne", region: "Hiiraan", issueDate: "27 AUGUST 2025" },
    { id: 251, name: "Xasan Maxamed Xalane", notaryName: "Xalane", district: "Buuloburta", region: "Hiiraan", issueDate: "27 AUGUST 2025" },
    { id: 252, name: "Daauud Xuseen Nuur", notaryName: "Beledweyne", district: "Beledweyne", region: "Hiiraan", issueDate: "27 AUGUST 2025" },
    { id: 253, name: "Xasan Maxamed Nuur", notaryName: "Abuuraas", district: "Kismaayo", region: "Jub.Hose", issueDate: "27 AUGUST 2025" },
    { id: 254, name: "Xabiib Maxamed Kulmiye", notaryName: "Jubba", district: "Kismaayo", region: "Jub. Hose", issueDate: "27 AUGUST 2025" },
    { id: 255, name: "Ismaaciil Xasan Wehliye", notaryName: "Wehliye", district: "Kismaayo", region: "Jub.Hose", issueDate: "27 AUGUST 2025" },
    { id: 256, name: "Muhayadiin Cabdikariin Maxamed", notaryName: "Gaalkacyo", district: "Gaalkacyo", region: "Mudug Gl", issueDate: "27 AUGUST 2025" },
    { id: 257, name: "Cabdullaahi Cali Maxamed", notaryName: "Towfiiq", district: "Gaalgacyo", region: "Mudug Gl", issueDate: "27 AUGUST 2025" },
    { id: 258, name: "Cumar Axmed Diiriye", notaryName: "Gaalkacyo Notary", district: "Gaalkacyo", region: "Mudug Gl", issueDate: "27 AUGUST 2025" },
    { id: 259, name: "Yuusuf Cabdisalaam Warsame", notaryName: "Geeska Afrika", district: "Gaalgacyo", region: "Mudug Pl", issueDate: "27 AUGUST 2025" },
    { id: 260, name: "Cabdiqaadir Faarax Nuur", notaryName: "Garyaqaan", district: "Garoowe", region: "Nugaal", issueDate: "27 AUGUST 2025" },
    { id: 261, name: "Ayuub Cabdixakiin Maxamed", notaryName: "Kaafi", district: "Garoowe", region: "Nugaal", issueDate: "27 AUGUST 2025" },
    { id: 262, name: "Sh. Maxamuud Yuusuf Maxamuud", notaryName: "Kulmiye", district: "Garoowe", region: "Nugaal", issueDate: "27 AUGUST 2025" },
    { id: 263, name: "Saciid Cabdullaahi Cabdi", notaryName: "Puntland", district: "Garoowe", region: "Nugaal", issueDate: "27 AUGUST 2025" },
    { id: 264, name: "Axmed Maxamuud Cabdiraxmaan", notaryName: "Al-Horyaal", district: "Jowhar", region: "Sh Dhexe", issueDate: "27 AUGUST 2025" },
    { id: 265, name: "Cabdishakuur Cumar Cali", notaryName: "Baalbaal", district: "Balcad", region: "Sh Dhexe", issueDate: "27 AUGUST 2025" },
    { id: 266, name: "Cabdullaahi Muxudiin Xasan", notaryName: "Barkulan", district: "Balcad", region: "Sh Dhexe", issueDate: "27 AUGUST 2025" },
    { id: 267, name: "Maxamed Cilmi Maxamed", notaryName: "Bulsho", district: "Balcad", region: "Sh Dhexe", issueDate: "27 AUGUST 2025" },
    { id: 268, name: "Maxamed Yuusuf Ibraahim", notaryName: "Cirro", district: "Balcad", region: "Sh Dhexe", issueDate: "27 AUGUST 2025" },
    { id: 269, name: "Cumar Maxamuud Carab", notaryName: "Deexey", district: "Balcad Ceel-Cadde", region: "Sh Dhexe", issueDate: "27 AUGUST 2025" },
    { id: 270, name: "Cabdullaahi Sh Maxamud Yabarow", notaryName: "Ger-cadde", district: "Balcad Caliyaale", region: "Sh Dhexe", issueDate: "27 AUGUST 2025" },
    { id: 271, name: "Maxamuud Xuseen Maxamed", notaryName: "Horyaal", district: "Balcad", region: "Sh Dhexe", issueDate: "27 AUGUST 2025" },
    { id: 272, name: "Cabdulqaadir Daa, uud Muudey", notaryName: "Jowhar", district: "Jowhar", region: "Sh Dhexe", issueDate: "27 AUGUST 2025" },
    { id: 273, name: "Cali Xaaji Maxamed Xasan", notaryName: "Sh Cali Xaaji", district: "Balcad", region: "Sh Dhexe", issueDate: "27 AUGUST 2025" },
    { id: 274, name: "Axmed Cali Cadaawe", notaryName: "Shaakir", district: "Balcad", region: "Sh Dhexe", issueDate: "27 AUGUST 2025" },
    { id: 275, name: "Daahir Cilmi Cali (Mucallim. Daahir)", notaryName: "Waayeel", district: "Balcad", region: "Sh Dhexe", issueDate: "27 AUGUST 2025" },
    { id: 276, name: "Maxamed Ckariim Maxamed", notaryName: "Jamhuuriya", district: "Balcad", region: "Sh Dhexe", issueDate: "27 AUGUST 2025" },
    { id: 277, name: "Salaad Cali Xasan", notaryName: "Qaboobe", district: "Warsheekh", region: "Sh Dhexe", issueDate: "27 AUGUST 2025" },
    { id: 278, name: "Axmed Muxumed Cali", notaryName: "Horseed Jowhar", district: "Jowhar", region: "Sh Dhexe", issueDate: "27 AUGUST 2025" },
    { id: 279, name: "Cabdiraxmaan Muuse Axmed", notaryName: "Amaana", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 280, name: "Cabdiraxmaan Salaad Axmed", notaryName: "Amiin Sunni", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 281, name: "Axmed Yaxye Maxamed", notaryName: "Bakooraan", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 282, name: "Cismaan Xasan Cabdi", notaryName: "Cismaan Dheere", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 283, name: "Cabdixamiid Cumar Cali", notaryName: "Duqow", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 284, name: "Ibraahim Cismaan Maxamed", notaryName: "Foodare", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 285, name: "Ismaaciil Maxamuud Nuur", notaryName: "Galeyr", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 286, name: "Maxamed Maxamuud Aadan", notaryName: "Guuleed", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 287, name: "Isxaaq Maxamed Isxaaq", notaryName: "Haldoor", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 288, name: "Maxamed Cabdiqaadir Xabiib", notaryName: "Imaam", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 289, name: "Mukhtaar Dheeg Cabdullaahi", notaryName: "Kaah", district: "Baraawe", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 290, name: "Xasan Ibraahim Sh Cusmaan", notaryName: "Kaariko", district: "Wanlawayne", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 291, name: "Mustaf Nuur Cali", notaryName: "Nootaayo Baraawe", district: "Baraawe", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 292, name: "Axmed Cabdiwaaxid Xuseen", notaryName: "Shabele", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 293, name: "Iqra Yuusuf Ibraahim", notaryName: "Sooyaal", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 294, name: "Ibraahim Cabdinuur Sheekh Aaden", notaryName: "Maka", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 295, name: "Cali Isaaq Xasan", notaryName: "Tartiil", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "27 AUGUST 2025" },
    { id: 296, name: "Abuubakar Xasan Shire", notaryName: "Shire", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "27 AUGUST 2025" },
    { id: 297, name: "Abuubakar Jeylaani Sh Abuukar", notaryName: "Al-Falaax", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "27 AUGUST 2025" },
    { id: 298, name: "Maxamed Cali Nuur", notaryName: "Barqadle", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "27 AUGUST 2025" },
    { id: 299, name: "Cali Maxamuud Jimcaale", notaryName: "Cali Biil", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "27 AUGUST 2025" },
    { id: 300, name: "Xasan Maxamed Carmo", notaryName: "Carmoole", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "27 AUGUST 2025" },
    { id: 301, name: "Maxamed Tahliil Xaashi", notaryName: "Deegaan", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "27 AUGUST 2025" },
    { id: 302, name: "Cabdiraxmaan Axmed Shire Guuleed", notaryName: "Dhiblaawe", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "27 AUGUST 2025" },
    { id: 303, name: "Maxamuud Xaaji Jimcaale (Biil)", notaryName: "Dr.Biil", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "27 AUGUST 2025" },
    { id: 304, name: "Cabdishakuur Xasan Cilmi", notaryName: "Furqaan", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "27 AUGUST 2025" },
    { id: 305, name: "Liibaan Jimcaale Ibraahim (Islow)", notaryName: "Liibaan", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "27 AUGUST 2025" },
    { id: 306, name: "Cabdixafiid Maxamed M Maxamuud", notaryName: "Madoobe", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "27 AUGUST 2025" },
    { id: 307, name: "Maxamed Mukhtaar Cabdullaahi", notaryName: "Mukhtaar", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "27 AUGUST 2025" },
    { id: 308, name: "Maxamed Cabdifataax Cismaan", notaryName: "Muutaale", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "27 AUGUST 2025" },
    { id: 309, name: "Najiib Cabdi Cali", notaryName: "Najiib", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "27 AUGUST 2025" },
    { id: 310, name: "Cabdullaahi Maxamed Muuse", notaryName: "Ogaal", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "27 AUGUST 2025" },
    { id: 311, name: "Caamir Cali Maxamuud", notaryName: "Sahan", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "27 AUGUST 2025" },
    { id: 312, name: "Cabdirisaaq Xasan Xuseen", notaryName: "Shaaciye", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "27 AUGUST 2025" },
    { id: 313, name: "Najib Xasan Cumar Maxamed", notaryName: "Shabeel", district: "Ceelasha Afgooye", region: "Sh. Hoose", issueDate: "27 AUGUST 2025" },
    { id: 314, name: "Xasan Warsame Cali", notaryName: "Suuley", district: "Ceelasha Afgooye", region: "Sh.Hoose", issueDate: "27 AUGUST 2025" },
    { id: 315, name: "Zakariye Mahad Diiriye", notaryName: "Xog-Ogaal", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "27 AUGUST 2025" },
    { id: 316, name: "Cabdixakiim Cabdiqaadir Muudey", notaryName: "Zoobe", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "27 AUGUST 2025" },
    { id: 317, name: "Feysal Cabdirashiid Axmed", notaryName: "Damal", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "27 AUGUST 2025" },
    { id: 318, name: "Maxamed Cali Maxamuud Xeyle", notaryName: "Lafoole", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "27 AUGUST 2025" },
    { id: 319, name: "Cabdiraxiim Maxamuud Maxamed", notaryName: "Durdur", district: "ERAAKA", region: "Togdheer", issueDate: "27 AUGUST 2025" },
    { id: 320, name: "Aadan Jimcaale Maxamed", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 321, name: "Aaden Cabdulqaadir Yaxye", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 322, name: "Abuubakar Yusuf Wardheere", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 323, name: "Axmed Ciise Cabdullaahi", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 324, name: "Axmed Maxamed Xasan (Mudey)", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 325, name: "Axmed Sh Cali Axmed Buraale", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 326, name: "Bashiir Maxamed Sheekh Maxamed", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 327, name: "Cabdinaasir Sh.Cali Jimcaale", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 328, name: "Cabdiraxmaan Warsame Siyaad", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 329, name: "Cabdi Aaden Macalin Cabdulle", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 330, name: "Cabdi Axmed Cali (Geedi)", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 331, name: "Cabdi Cabdullaahi Abtidoon", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 332, name: "Cabdi Cadaawe Cali", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 333, name: "Cabdifitaax Cumar Maxamed", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 334, name: "Cabdinaasir Abuukar Xaaji Dheere", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 335, name: "Cabdulqaadir Cumar Kaatib", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 336, name: "Cabdirashid Cabdullaahi Maxamed", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 337, name: "Cabdirashiid Cabdullaahi Maxamuud", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 338, name: "Cabdiraxman Maxamuud Cali (Time Cade)", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 339, name: "Cabdirisaaq Maxamed Cabdulle (Tiikey)", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 340, name: "Cabdirisaaq Xasan Cilmi", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 341, name: "Cabdulqaadir Cabdullaahi Maxamed", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 342, name: "Cabdulqaadir Yalaxow Hiraabe", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 343, name: "Cabdulwahaab Nuur Mahdi", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 344, name: "Cali Maxamuud Jimcaale", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 345, name: "Cali Sheekh Cabdi", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 346, name: "Cali Xaashi Cali Ugaas", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 347, name: "Cali Xasan Faarax", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 348, name: "Cali Yuusuf Xuseen", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 349, name: "Ciise Cabdirahman Maxamed", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 350, name: "Cismaan Maxamed Ismaaciil", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 351, name: "Cumar Maxamed Farax (Gomed)", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 352, name: "Daahir Cabdi Maxamuud (Boolis)", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 353, name: "Daahir Maxamuud Maxamed", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 354, name: "Daahir Xaaji Xasan Axmed", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 355, name: "Deeq Cabdi Rayid", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 356, name: "Ibraahim Maxamed Axmed", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 357, name: "Ibrahim Xasan Sheekh Xuseen", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 358, name: "Ismaacil Maxamed Cabdullaahi", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 359, name: "Khalif Sh Ibraahim Dhiblaawe", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 360, name: "Maxamed Diiriye Sabriye", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 361, name: "Maxamed Sh. Axmed Khaliif", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 362, name: "Maxamed Xuseen Xasan", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 363, name: "Maxamed Cabdulqaadir Sh.Xasan (Amiin)", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 364, name: "Maxamed Cali Nuur (Socdaal)", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 365, name: "Maxamed Cumar Ibraahim", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 366, name: "Maxamed Ibraahim Maxamed Cali", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 367, name: "Maxamed Sh Axmed Xasan", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 368, name: "Maxamed Xaaji Jimcaale (Biil)", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 369, name: "Maxamed Xaaji Shiikhey Abati", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 370, name: "Maxamuud Axmed Xasan (Dalab)", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 371, name: "Maxamuud Cali Cumar", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 372, name: "Muriidi Muumin Axmed", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 373, name: "Muumin Axmed Abubakar", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 374, name: "Muxuyadiin Xasan Maxamed", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 375, name: "Saciid Cali Cosoble", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 376, name: "Saciid Cali Maxamuud", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 377, name: "Sh Axmed Cali Cismaan", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 378, name: "Sh Cabdi limaan Cumar", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 379, name: "Xassan Sh. Maxamed Farxaan", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 380, name: "Xuseen Aaden Xasan Yaasiin", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 381, name: "Xuseen Maxamuud Muuse", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 382, name: "Xusseen Maxamed Calasow", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 383, name: "Yaasiin Cabdi Xasan", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 384, name: "Yoonis Cabdiraxman Maxamud Cali", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 385, name: "Yusuf Tuurxume Jimcaale", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 386, name: "Cabdikhadar Maxamed Xasan", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 387, name: "Idris Maxamed Cusmaan", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 388, name: "Liibaan Cabdullaahi Muumin", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 389, name: "Maxamed M.Maxamuud Cumar (Madoobe)", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 390, name: "Maxamed Xuseen Rooble", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 391, name: "Najiib Xasan Cumar Maxamed", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 392, name: "Xasan Maxamed Axmed (Suni)", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 393, name: "Maxamed Cusmaan Ibraahim", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 394, name: "Xuseen Isgow Xuseen", notaryName: "MA LAHAN)", district: "MA LAHAN", region: "Banaadir", issueDate: "1 JUNE 2019" },
    { id: 395, name: "Kayse Saciid Cartan", notaryName: "Qaaddi", district: "Boondheere Wadada Jubba", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 396, name: "Cumar Faarax Axmed", notaryName: "Baraawe", district: "Cabdicasiis Marinaaya", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 397, name: "Cali Abuukar Xaayow", notaryName: "Cali Marduuf", district: "Cabdicasiis Waxda Lowyacade", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 398, name: "Cali Xasan Cali Nuur", notaryName: "Talasan", district: "Cabdicasiis Waxda Lowyacade", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 399, name: "Cabdi Axmed Cali Geedi", notaryName: "Ummadda", district: "Daaru-Salaam", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 400, name: "Cismaan Cabdulle Cabdi Cisman (Jeelle)", notaryName: "Al-Taqwa", district: "Daaru-Salaam", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 401, name: "Xasan Maxamed Sh. Maxamed", notaryName: "Baryare", district: "Daaru-Salaam", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 402, name: "Cabdisalaan Cabdiraxmaan Caafi Cabdulle", notaryName: "Caafi", district: "Daaru-Salaam", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 403, name: "Cumar Cali Maxamuud Cawaale", notaryName: "Cali-Agoon", district: "Daaru-Salaam", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 404, name: "Xuseen Cali Maxamuud", notaryName: "Cawaale", district: "Daaru-Salaam", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 405, name: "Maxamed Cabdi Maxamed Xuseen", notaryName: "Gurmad", district: "Daaru-Salaam", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 406, name: "Cabdifataax Axmed Cabdulle Kulan", notaryName: "Kaamil", district: "Daaru-Salaam", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 407, name: "Feysal Maxamed Maxamuud", notaryName: "Mustaqbal", district: "Daaru-Salaam", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 408, name: "Cumar Cabdi Cadaawe", notaryName: "Suldaan", district: "Daaru-Salaam", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 409, name: "Haashim Maxamed Yusuf (Kabaqori)", notaryName: "Kabaqori", district: "Daaru-Salaam", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 410, name: "Cabdikariim Xasan Nuur Maxamed", notaryName: "Aflax", district: "Dayniile Aargadda Raadayrka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 411, name: "Cabdullaahi Aadan Maxamuud", notaryName: "Kaafiye", district: "Dayniile SiisiiMasjid Muumino", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 412, name: "Maxamuud Maxamed Cali Cashara", notaryName: "Cashara", district: "Dharkeynley AJabka Madiina", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 413, name: "Xaydar Cali Odowaa Cosoble", notaryName: "Odawaa", district: "Dharkeynley AJabka Madiina", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 414, name: "Maxamed Sh Axmed Xasan", notaryName: "Hilaal", district: "Dharkeynley Macmacaanka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 415, name: "Maxamed Cumar Ibraahim", notaryName: "Rasmi Muqdsiho", district: "Dharkeynley Macmacaanka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 416, name: "Ibraahim Daahir Xuseen", notaryName: "Rayaan", district: "Dharkeynley Macmacaanka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 417, name: "Xusseen Maxamed Calasow", notaryName: "Tawakal", district: "Dharkeynley SuuqLiif", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 418, name: "Ciise Cabdirahman Maxamed", notaryName: "Fiqi", district: "Garasbaaley Zoone F.KM15", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 419, name: "Aadan Maxamed Carmo", notaryName: "Carmo", district: "Garasbaaley Tabl. Sh Ibraahim", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 420, name: "Ismaaciil Macalin Maxamuud Cali", notaryName: "Salaama", district: "Gubadley", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 421, name: "Cabdiraxman Sh Maxamed Xasan", notaryName: "Alxarameyn", district: "Gubadley", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 422, name: "Cabdishakuur Axmed Maxamed Maxamuud", notaryName: "Caddawe", district: "Hoden Cadaani Tower2 Makka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 423, name: "Ibraahim lidle Suleymaan", notaryName: "Xaqdoon", district: "Hoden Cadaani Tower2 Makka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 424, name: "Cali Macalin Xasan Maxamuud", notaryName: "Kalsan", district: "Hoden Horjeedka Tree-Piano", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 425, name: "Maxamed Cabdi Axmed", notaryName: "Qaran", district: "Hoden Isgoyska Taleex", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 426, name: "Faadumo Cusmaan Xaaji Ismaaciil", notaryName: "Tagsan", district: "Hoden Isgoyska Taleex", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 427, name: "Cabdiraxmaan Maxamed Xasan", notaryName: "Qaanuuni", district: "Hoden Isgoyska. Taleex", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 428, name: "Axmed Maxamuud Xuseen Diirshe", notaryName: "Diirshe", district: "Hoden Jidka Makka Almukrm", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 429, name: "Cabdi Yuusuf Xasan (Maahir)", notaryName: "Maahir", district: "Hoden Jidka Taleex", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 430, name: "Ibraahim Maxamed Axmed", notaryName: "Garsoor", district: "Hoden Jidka Taleex", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 431, name: "Cartan Cabdisalaam Calasow Dabey", notaryName: "Gardoon", district: "Hoden Jidka Tarbuunka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 432, name: "Xalwo Maxamed Axmed", notaryName: "Gorgor", district: "Hoden Jidka Tarbuunka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 433, name: "Maxamed Aaden Sheekh Nuur", notaryName: "Qooje", district: "Hoden Jidka Tarbuunka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 434, name: "Cabdiqaadir Cali Siyaad", notaryName: "Siyaad", district: "Hoden Jidka Tarbuunka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 435, name: "Cabdi Axmed Cali (Geedi)", notaryName: "Geedi", district: "Hoden Madaxt.C/qasim", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 436, name: "Cali Xaaji Maxamed Warsame", notaryName: "Warsame", district: "Hoden Oktober Faanoole", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 437, name: "Xasan Axmed Cabdulle", notaryName: "Irshaad", district: "Hoden Zoobe KM5", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 438, name: "Liibaan Cusmaan Aadan", notaryName: "Liban", district: "Hoden Zoobe KM5", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 439, name: "Xasan Maxamed Axmed (Sunni)", notaryName: "Sunni", district: "Hoden Zoobe KM5", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 440, name: "Cabdirisaaq Xasan Cilmi", notaryName: "Kulmiye", district: "Howlwadaag Isg. Baar Ubax", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 441, name: "Cabdi Cabdullaahi Abtidoon", notaryName: "Muqdisho Abtidon", district: "Howlwadaag Isg. Baar Ubax", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 442, name: "Aadan Jimcaale Maxamed", notaryName: "Dayax", district: "Howlwadaag Jidka Sodonka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 443, name: "Cabdirashiid Maxamuud Axmed", notaryName: "Hilaaf", district: "Howlwadaag Jidka Sodonka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 444, name: "Maxamed Nuur Maxamuud", notaryName: "Diiwaan", district: "Howlwadaag Sayidka Makka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 445, name: "Cali Yuusuf Xuseen", notaryName: "Xamar", district: "Howlwadaag Shiirkole", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 446, name: "Yoonis Cabdiraxman Maxamud Cali", notaryName: "Banaadir Danuun", district: "Howlwadaag Shiirkole", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 447, name: "Bashiir Macalim Maxamed Ibraahim", notaryName: "Afrax", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 448, name: "Cabdiqaadir Xasan Faarax", notaryName: "Al Cadaala", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 449, name: "Maxamed Cabdulqaadir Sh. Xasan (Amiin)", notaryName: "Amiin", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 450, name: "Cabdullaahi Cabdi Xirsi Faarax", notaryName: "Asal", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 451, name: "Axmed Ciise Cabdullaahi", notaryName: "Banaadir A Ciise", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 452, name: "Cabdiraxmaan Warsame Siyaad", notaryName: "Banaadir Warsame", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 453, name: "Maxamed Cabdiraxmaan Sh.Maxamed", notaryName: "Boqole", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 454, name: "Cabdulqaadir Ibraahim Cali", notaryName: "Caalami", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 455, name: "Maxamed Dalmar Axmed", notaryName: "Dalmar", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 456, name: "Abuubakar Xuseen Maxamed", notaryName: "Dhagajuun", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 457, name: "Shaafici Maxamed Axmed Cali", notaryName: "Dulqaad", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 458, name: "Daahir Maxamuud Maxamed", notaryName: "ENP Xamar", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 459, name: "Aadan Cali Cadow", notaryName: "Hiraabe", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 460, name: "Cali Xaashi Cali Ugaas", notaryName: "Horseed", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 461, name: "Ismaaciil Cali Axmed Mahad-Alle", notaryName: "Hubaal", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 462, name: "Aadan Cilmi Maxamed (Macalin Aadan)", notaryName: "Hubiye", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 463, name: "Maxamed Xirsi Sheekhdoon", notaryName: "Ileys", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 464, name: "Abuukar Cabdulle Maxamed", notaryName: "Jaran", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 465, name: "Maxamed Sh. Axmed Khaliif", notaryName: "Khalifa", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 466, name: "Salaad Maxamed Jaamac", notaryName: "Macruuf", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 467, name: "Cumar Sh Axmed Ciise", notaryName: "Mubaarak", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 468, name: "Saciid Cali Cosoble", notaryName: "Muqdisho Saciid", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 469, name: "Maxamed Cali Nuur (Socdaal)", notaryName: "Muqdisho Socdaal", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 470, name: "Cabdullaahi Xasan Wehliye", notaryName: "Qalam", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 471, name: "AxmedNuur Cabdi Warsame", notaryName: "Qoole", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 472, name: "Maxamed Cismaan Wehliye", notaryName: "Salaam", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 473, name: "Ismaacil Maxamed Cabdullaahi", notaryName: "Shahaad", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 474, name: "Saciid Cali Maxamuud", notaryName: "Taakulo", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 475, name: "Maxamed Cabdullahi Maxamed Siyaad", notaryName: "Tayo", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 476, name: "Cabdirisaaq Maxamed Cabdulle (Tiikey)", notaryName: "Tiikey", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 477, name: "Yusuf Tuurxume Jimcaale", notaryName: "Tuurxume", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 478, name: "Cabdiraxmaan Nuur Tuuryare", notaryName: "Tuuryare", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 479, name: "Cabdullaahi Maxamed Siyaad (Gaab)", notaryName: "Wadani", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 480, name: "Cali Xasan Faarax", notaryName: "Xakiim", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 481, name: "Maxamed Yacquub Isaaq Aaden", notaryName: "Xamarcade", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 482, name: "Axmed Ismaaciil Barre (Madaxey)", notaryName: "Xaqdhowr", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 483, name: "Cabdiraxmaan Xasan Cumar", notaryName: "Soomaaliya", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 484, name: "Muqtaar Macalim Cilmi Maxamed", notaryName: "Bayaan", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 485, name: "Xuseen Maxamuud Muuse", notaryName: "If-ka", district: "Kaaraan Boosteejada", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 486, name: "Xasan Cusmaan Wehliye", notaryName: "Xamari", district: "Kaaraan Isgoyska Sanca", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 487, name: "Cabdulqaadir Cabdullaahi Maxamed", notaryName: "Alnuur", district: "Kaaraan Isgoyska Sanca", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 488, name: "Cabdirashid Cabdullaahi Maxamed", notaryName: "Aw-Muuse", district: "Kaaraan Isgoyska Sanca", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 489, name: "Maxamuud Cali Cumar", notaryName: "Biyey", district: "Kaaraan Isgoyska Sanca", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 490, name: "Idriis Cabdiraxmaan Maxamuud", notaryName: "Wadan", district: "Kaaraan Isgoyska Sanca", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 491, name: "Cusmaan Xasan Cusmaan", notaryName: "Baari", district: "Kaaraan Suuq Kaaraan", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 492, name: "Xasan Dhuxulow Xasan Raage", notaryName: "Dhuxulow", district: "Kaaraan Suuq Kaaraan", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 493, name: "Xasan Nuur Maxamuud", notaryName: "Midnimo", district: "Kaaraan Suuq Kaaraan", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 494, name: "Axmed Maxamed Axmed", notaryName: "Siliki", district: "Kaaraan Suuq Kaaraan", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 495, name: "Cabdikariim Maxamed Biyow", notaryName: "Biyow", district: "Kaaraan Suuqa Dahabka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 496, name: "Abuubakar Maxamed Suufi Maxamed", notaryName: "Bisle", district: "Kaaraan Xaliima Hiite", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 497, name: "Cabaas Cabdullaahi Bootaan Sahal", notaryName: "Bootaan", district: "Kaxda Gnrl.Liiqliiqato", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 498, name: "Maxamed Aadan Qorane", notaryName: "Qorane", district: "Kaxda Gnrl. Liiqliiqato", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 499, name: "Maxamuud Aadan Xaashi Jimcaale", notaryName: "Habarwaa", district: "Kaxda Shimbiroole", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 500, name: "Xasan Aadan Ibraahim Maxamed", notaryName: "Bilaal", district: "Kaxda Shinbroole", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 501, name: "Sh Axmed Cali Cismaan", notaryName: "Talawadaag", district: "Waabari Isgoyska Dabka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 502, name: "Xuseen Maxamed Kadiye", notaryName: "Kadiye", district: "Waabari Jidka 21 Octoober", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 503, name: "Xuseen Cabdi Cilmi", notaryName: "Cilmi", district: "Waabari Jidka 21 Octoober", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 504, name: "Cabdullaahi Cumar Cabdi", notaryName: "Cilmi", district: "Waabari Jidka 21 Octoober", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 505, name: "Cusman Cumar Kaatib", notaryName: "Tahajid", district: "Waabari Jidka 21 Octoober", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 506, name: "Axmed Cabdiraxmaan Wehliye Maalin", notaryName: "Wehliye", district: "Waabari Jidka 21 Octoober", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 507, name: "Cabdifitaax Faarax Naaleeye", notaryName: "Naaleeye", district: "Waabari Jidka Liberia", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 508, name: "Cabdiraxim Ibraahim Macalin", notaryName: "Sadsoor", district: "Waabari Jidka Makka Almuk.", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 509, name: "Maxamed Cabdi Daahir Colaad", notaryName: "Colaad", district: "Waabari KM4 Jidka Airporka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 510, name: "Maxamuud Nuur Maxamed", notaryName: "Qoobeey", district: "Waabari Maajo Makka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 511, name: "Maxamed Diiriye Sabriye", notaryName: "Sabriye", district: "Waabari Maajo Makka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 512, name: "Abuubakar Muumin Axmed", notaryName: "Baana", district: "Waabari Shaqaalaha Makka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 513, name: "Maxamed Muxuyadiin Caraale", notaryName: "Naafic", district: "Waabari Shaqaalaha Makka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 514, name: "Idris Maxamed Cusmaan", notaryName: "Waabari", district: "Waabari Shaqaalaha Makka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 515, name: "Dhaqane Isxaaq Cabdi", notaryName: "Dhaqane", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 516, name: "Maxamed Ciise Dhowrane", notaryName: "Dhowrane", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 517, name: "Aweys Sheekh Cali Qaasim", notaryName: "Horyaal", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 518, name: "Aaden Cabdulqaadir Yaxye", notaryName: "Hufane", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 519, name: "Cali Sheekh Cabdi", notaryName: "Ilkadahab", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 520, name: "Bashiir Maxamed Sheekh Maxamed", notaryName: "Karaama", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 521, name: "Cismaan Maxamed Ismaaciil", notaryName: "Osmaan", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 522, name: "Yaasiin Cabdi Xasan", notaryName: "Rogaal", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 523, name: "Badrudiin Sheekh Rashiid Ibraahiim", notaryName: "Xijaaz", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 524, name: "Cabdifitaax Cumar Maxamed", notaryName: "Kaatib", district: "Waabari Xaaji Baasto", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 525, name: "Cabdulqaadir Cumar Kaatib", notaryName: "Kaatib", district: "Waabari Xaaji Baasto", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 526, name: "Aweys Cismaan Xaaji Axmed", notaryName: "Mataanaha", district: "Wadajir Jidka Airporka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 527, name: "Cabdiraxmaan Daahir Cabdi Booliis", notaryName: "Barako", district: "Wadajir Isgoyska Korontada", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 528, name: "Cabdi Axmed Caseyr (Gaani)", notaryName: "Banaadir-Gaani", district: "Wadajir KM4 Jidka Airporka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 529, name: "Axmed Cartan Cali (Qaasim)", notaryName: "Khayraat", district: "Wadajir KM4 Jidka Airporka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 530, name: "Cabdiraxman Maxamuud Cali (Time Cade)", notaryName: "Banaadir TimeCade", district: "Wadajir KM4 Jidka Airporka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 531, name: "Cumar Maxamed Faarax (Gomed)", notaryName: "Faaruuq", district: "Wadajir KM4 Jidka Airporka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 532, name: "Cabdullaahi Faarax Qaarey", notaryName: "Qaarey", district: "Wadajir KM4 Jidka Airporka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 533, name: "Cabdi Aaden Macalin Cabdulle", notaryName: "Mucallim", district: "Warta-Nabada Jid. Mareexaan", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 534, name: "Maxamed Cabdiraxmaan Aadan", notaryName: "Daacad", district: "Warta-Nabada Jidka Sodonka", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 535, name: "Ciise Xaaji Cumar Yare", notaryName: "Yaroow Cigalle", district: "Warta-Nabada Jidka Wadnaha", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 536, name: "Maxamed Axmed Nuur", notaryName: "Alkowthar", district: "Warta-Nabada Jidka Wadnaha", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 537, name: "Yaxya Maxamuud Maxamed", notaryName: "Kaay-kaay", district: "Warta-Nabada Labbo Dhagax", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 538, name: "Cabdirisaaq Mire Maxamed", notaryName: "Xalane", district: "Warta-Nabada labbo Dhagax", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 539, name: "Xuseen Aaden Xasan Yaasiin", notaryName: "Xaydar", district: "Warta-Nabada Labbo Dhagex", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 540, name: "Cabdinaasir Abuukar Xaaji Dheere", notaryName: "Dheere", district: "X/Weyne Ex-Shanem Super", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 541, name: "Maxamed Maxamuud Maxamed (Dr Luu)", notaryName: "Irmaan", district: "X/Weyne Kacaan Uunlaaye", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 542, name: "Muriidi Muumin Axmed", notaryName: "Rasmi Xamar", district: "X/Weyne Kacaan Uunlaaye", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 543, name: "Muumin Axmed Abubakar", notaryName: "Rasmi Xamar", district: "X/Weyne Kacaan Uunlaaye", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 544, name: "Cabdifataax Cabdisamad Cabdiraxmaan", notaryName: "Shaahid", district: "Xamarweyne Muqdisho Mall", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 545, name: "Yaasiin Axmed Cusmaan", notaryName: "Al-Aamin", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 546, name: "Bashiir Siyaad Maxamed", notaryName: "Albashiir", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 547, name: "Maxamed Xaaji Shiikhey Abati", notaryName: "Alfaqi", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 548, name: "Cabdiqadir Sheekh Cabdiwahab Maxamed", notaryName: "Cabdiwahaab", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 549, name: "Aweys Yuusuf Caraale", notaryName: "Caraale", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 550, name: "Naciima Cali Barre", notaryName: "Dalsan", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 551, name: "Xamza Maxamed Cabdullaahi", notaryName: "Guudle", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 552, name: "Ciise Maxamed Yuusuf", notaryName: "Himilo", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 553, name: "Maxamed Cabdullaahi Xuseen", notaryName: "Kaahiye", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 554, name: "Cabdinaasir Sh. Cali Jimcaale", notaryName: "Kheyre", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 555, name: "Cabdulwahaab Nuur Mahdi", notaryName: "Kulan", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 556, name: "Muniira Cabdiqaadir Khadar", notaryName: "Miftaax", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 557, name: "Cabdiqaadir Cabdi Axmed", notaryName: "Bakaal", district: "Xamarweyne Via Rooma", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 558, name: "Xassan Sh. Maxamed Farxaan", notaryName: "Muq.Studio legale", district: "Yaaqshid 4ta Jerdiino", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 559, name: "Xasan Maxamed Cali Barrow", notaryName: "Barrow", district: "Yaaqshid Ex-Suuqa Xoolaha", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 560, name: "Abuubakar Yusuf Wardheere", notaryName: "Wardheere", district: "Yaaqshid Ex-Suuqa Xoolaha", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 561, name: "Maxamed Nuur Maxmed Cali", notaryName: "Baxnaan", district: "Yaaqshid Horseed", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 562, name: "Cali Maxamed Cilmi", notaryName: "Harsan", district: "Yaaqshid Isgoyska Baar Ayaan", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 563, name: "Cabdullaahi Axmed Xirsi", notaryName: "Mahadale", district: "Yaaqshid Isgoyska Baar Ayaan", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 564, name: "Nuur Cali Culusow Geedi", notaryName: "Culusow", district: "Yaaqshid Isgoyska Siinaay", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 565, name: "Cabdiwali Xasan Culusow Cali", notaryName: "Al-faraj", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 566, name: "Maxamed Cabdullaahi Hagar Maxamuud", notaryName: "Balli", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 567, name: "Cabdiraxmaan Cali Maxamed Hiraabe", notaryName: "Cali Hiraabe", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 568, name: "Nuux Cabdullahi Cusmaan", notaryName: "Daryeel", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 569, name: "Nuur Maxamed Maxamuud", notaryName: "Dhooley", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 570, name: "Cabdi Cadaawe Cali", notaryName: "Ex-Banaadir", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 571, name: "Maxamuud Cabdi Macalin Abuukar", notaryName: "Fanax", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 572, name: "Maxamuud Maxamed Cabdi", notaryName: "Findhig", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 573, name: "Cabdiqaadir Salaad Maxamed", notaryName: "Haleel", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 574, name: "Cabdullaahi Sh Daahir Xasan", notaryName: "Muqdisho Waana", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 575, name: "Daahir Xaaji Xasan Axmed", notaryName: "Muqdisho Waana", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 576, name: "Maxamed Ibraahim Maxamed Cali", notaryName: "Muqdisho ShIbrahim", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 577, name: "Qaasim Maxamed Ibrahim Barrow", notaryName: "Qaasimmi", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 578, name: "Maxamed Xuseen Xasan", notaryName: "Talawadaag", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 579, name: "Cabdiraxmaan Xuseen Maxamuud", notaryName: "Timo-weyne", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 580, name: "C\qaadir Maxamed Cosoble", notaryName: "Waasuge", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 581, name: "Safiyo Yuusuf Tuurxume", notaryName: "Xaaji Tuurxume", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 582, name: "Maxamed Salaad Xasan", notaryName: "Asiib", district: "Yaaqshid Suuqa Xoolaha", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 583, name: "Aweys Ibraahim Xuseen", notaryName: "Aweis", district: "Yaaqshid Towfiiq", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 584, name: "Muxuyadiin Xasan Maxamed", notaryName: "Azhari", district: "Yaaqshid Towfiiq", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 585, name: "Ibrahim Xasan Sheekh Xuseen", notaryName: "Towfiiq", district: "Yaaqshid Towfiiq", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 586, name: "Cabdullaahi Sh Ibraahim Aadan (Xaydar)", notaryName: "Arlaadi", district: "Baydhabo", region: "Banaadir", issueDate: "18 JULY 2024" },
    { id: 587, name: "Ibraahim Maxamed Cali", notaryName: "Manhal", district: "Baydhabo", region: "Baay", issueDate: "18 JULY 2024" },
    { id: 588, name: "Cabdirisaaq Yacquub Xasan", notaryName: "Marwaaz", district: "Baydhabo", region: "Baay", issueDate: "18 JULY 2024" },
    { id: 589, name: "Khadiijo Axmed Muudey", notaryName: "Muudey", district: "Baydhabo", region: "Baay", issueDate: "18 JULY 2024" },
    { id: 590, name: "Xuseen Isgoowe Xuseen (Xaqsoor)", notaryName: "Xaqsoor", district: "Baydhabo", region: "Baay", issueDate: "18 JULY 2024" },
    { id: 591, name: "Maxamed Mire Axmed", notaryName: "Boosaaso", district: "Boosaaso", region: "Baay", issueDate: "18 JULY 2024" },
    { id: 592, name: "Xasan Muuse Nuux", notaryName: "Karkaar", district: "Qardho", region: "Barri", issueDate: "18 JULY 2024" },
    { id: 593, name: "Cabdullaahi Saciid Cismaan", notaryName: "Saadaal", district: "Boosaaso", region: "Barri", issueDate: "18 JULY 2024" },
    { id: 594, name: "Mahad Maxamed Cabdi", notaryName: "Shaahid", district: "Cabudwaaq", region: "Barri", issueDate: "18 JULY 2024" },
    { id: 595, name: "Cabdinaasir Maxamed Xasan", notaryName: "Al-hudaa", district: "Cabudwaaq", region: "Galgaduud", issueDate: "18 JULY 2024" },
    { id: 596, name: "Cabdullaahi Maxamaed Maxamuud", notaryName: "Bayaan Galmudug", district: "Dhuusanmareeb", region: "Galgaduud", issueDate: "18 JULY 2024" },
    { id: 597, name: "Cabdi Abshir Nuure (Dalamr)", notaryName: "Daljir", district: "Dhuusamareeb", region: "Galgaduud", issueDate: "18 JULY 2024" },
    { id: 598, name: "Cabdigargaar Axmed Xaashi", notaryName: "Gargaar", district: "Cabudwaaq", region: "Galgaduud", issueDate: "18 JULY 2024" },
    { id: 599, name: "Axmed Nuur Xasan", notaryName: "Guriceel", district: "Guriceel", region: "Galgaduud", issueDate: "18 JULY 2024" },
    { id: 600, name: "Bashiir Xuseen Maxamed", notaryName: "Hanaano", district: "Dhuusamareeb", region: "Galgaduud", issueDate: "18 JULY 2024" },
    { id: 601, name: "Yoonis Axmed Maxamed", notaryName: "Jaameeye", district: "Cadaado", region: "Galgaduud", issueDate: "18 JULY 2024" },
    { id: 602, name: "Daahir Xasan Faarax", notaryName: "Januune", district: "Dhuusamareeb", region: "Galgaduud", issueDate: "18 JULY 2024" },
    { id: 603, name: "Cabdiraxmaan Maxamuud Maxamed", notaryName: "Kaamil", district: "Cadaado", region: "Galgaduud", issueDate: "18 JULY 2024" },
    { id: 604, name: "Cabdulaahi Daahir Cabdi", notaryName: "Sumcad", district: "Guriceel", region: "Galgaduud", issueDate: "18 JULY 2024" },
    { id: 605, name: "Dayib Aadam Maxamed", notaryName: "Taakulo Galmudug", district: "Dhuusamareeb", region: "Galgaduud", issueDate: "18 JULY 2024" },
    { id: 606, name: "Aadan Maxamed Axmed (Afgooye)", notaryName: "Bile", district: "Baladxaawo", region: "Galgaduud", issueDate: "18 JULY 2024" },
    { id: 607, name: "Maxamed Xasan Ibraahim", notaryName: "Ganaane", district: "Luuq", region: "Gedo", issueDate: "18 JULY 2024" },
    { id: 608, name: "Maxamed Cusmaan Ibraahim", notaryName: "Caddaala", district: "Baladweyne", region: "Gedo", issueDate: "18 JULY 2024" },
    { id: 609, name: "Liibaan Cabdullaahi Muumin", notaryName: "Liibaan", district: "Baladweyne", region: "Hiiraan", issueDate: "18 JULY 2024" },
    { id: 610, name: "Xasan Maxamed Xalane", notaryName: "Xalane", district: "Buuloburta", region: "Hiiraan", issueDate: "18 JULY 2024" },
    { id: 611, name: "Xasan Maxamed Nuur", notaryName: "Abuuraas", district: "Kismaayo", region: "Hiiraan", issueDate: "18 JULY 2024" },
    { id: 612, name: "Xabiib Maxamed Kulmiye", notaryName: "Jubba", district: "Kismaayo", region: "Jub.Hose", issueDate: "18 JULY 2024" },
    { id: 613, name: "Ismaaciil Xasan Wehliye", notaryName: "Wehliye", district: "Kismaayo", region: "Jub. Hose", issueDate: "18 JULY 2024" },
    { id: 614, name: "Muhayadiin Cabdikariin Maxamed", notaryName: "Gaalkacyo", district: "Gaalkacyo", region: "Jub.Hose", issueDate: "18 JULY 2024" },
    { id: 615, name: "Cabdullaahi Cali Maxamed", notaryName: "Towfiiq", district: "Gaalgacyo", region: "Mudug G", issueDate: "18 JULY 2024" },
    { id: 616, name: "Yuusuf Cabdisalaam Warsame", notaryName: "Geeska Afrika", district: "Gaalgacyo", region: "Mudug G", issueDate: "18 JULY 2024" },
    { id: 617, name: "Cabdiqaadir Faarax Nuur", notaryName: "Garyaqaan", district: "Garoowe", region: "Mudug Pl", issueDate: "18 JULY 2024" },
    { id: 618, name: "Sh.Maxamuud Yuusuf Maxamuud", notaryName: "Kulmiye", district: "Garoowe", region: "Nugaal", issueDate: "18 JULY 2024" },
    { id: 619, name: "Saciid Cabdullaahi Cabdi", notaryName: "Puntland", district: "Garoowe", region: "Nugaal", issueDate: "18 JULY 2024" },
    { id: 620, name: "Cabdishakuur Cumar Cali", notaryName: "Baalbaal", district: "Balcad", region: "Nugaal", issueDate: "18 JULY 2024" },
    { id: 621, name: "Cabdullaahi Muxudiin Xasan", notaryName: "Barkulan", district: "Balcad", region: "Sh Dhexe", issueDate: "18 JULY 2024" },
    { id: 622, name: "Maxamed Cilmi Maxamed", notaryName: "Bulsho", district: "Balcad", region: "Sh Dhexe", issueDate: "18 JULY 2024" },
    { id: 623, name: "Ibraahim Maxamed Yuusuf", notaryName: "Cirro", district: "Balcad", region: "Sh Dhexe", issueDate: "18 JULY 2024" },
    { id: 624, name: "Cumar Maxamuud Carab", notaryName: "Deexey", district: "Balcad Ceel-Cadde", region: "Sh Dhexe", issueDate: "18 JULY 2024" },
    { id: 625, name: "Maxamuud Xuseen Maxamed", notaryName: "Horyaal", district: "Balcad", region: "Sh Dhexe", issueDate: "18 JULY 2024" },
    { id: 626, name: "Bilaal Xamsa Maxamed", notaryName: "Jamhuuriya", district: "Balcad", region: "Sh Dhexe", issueDate: "18 JULY 2024" },
    { id: 627, name: "Cali Xaaji Maxamed Xasan", notaryName: "Sh Cali Xaaji", district: "Balcad", region: "Sh Dhexe", issueDate: "18 JULY 2024" },
    { id: 628, name: "Daahir Cilmi Cali (Mucallim. Daahir)", notaryName: "Waayeel", district: "Balcad", region: "Sh Dhexe", issueDate: "18 JULY 2024" },
    { id: 629, name: "Cabdiraxmaan Axmed Cali", notaryName: "Zaahir", district: "Balcad", region: "Sh Dhexe", issueDate: "18 JULY 2024" },
    { id: 630, name: "Cabdiraxmaan Muuse Axmed", notaryName: "Amaana", district: "Afgooye Ceelasha", region: "Sh Dhexe", issueDate: "18 JULY 2024" },
    { id: 631, name: "Axmed Yaxye Maxamed", notaryName: "Bakooraan", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "18 JULY 2024" },
    { id: 632, name: "Cismaan Xasan Cabdi", notaryName: "Cismaan Dheere", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "18 JULY 2024" },
    { id: 633, name: "Maxamed Xaashi Maxamuud", notaryName: "Daalo", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "18 JULY 2024" },
    { id: 634, name: "Maxamed Cali Ibraahim", notaryName: "Hareeri", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "18 JULY 2024" },
    { id: 635, name: "Xasan Ibraahim Sh Cusmaan", notaryName: "Kaariko", district: "Wanlawayne", region: "Sh Hoose", issueDate: "18 JULY 2024" },
    { id: 636, name: "Iqra Yuusuf Ibraahim", notaryName: "Sooyaal", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "18 JULY 2024" },
    { id: 637, name: "Abuubakar Xasan Shire", notaryName: "Shire", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "18 JULY 2024" },
    { id: 638, name: "Abuubakar Jeylaani Sh Abuukar", notaryName: "Al-Falaax", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "18 JULY 2024" },
    { id: 639, name: "Maxamed Cali Nuur", notaryName: "Barqadle", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 640, name: "Cali Maxamuud Jimcaale", notaryName: "Cali Biil", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "18 JULY 2024" },
    { id: 641, name: "Xasan Maxamed Carmo", notaryName: "Carmoole", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 642, name: "Axmed Xasan Shidane", notaryName: "Daaru Salaam", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "18 JULY 2024" },
    { id: 643, name: "Feysal Cabdirashiid Axmed", notaryName: "Damal", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "18 JULY 2024" },
    { id: 644, name: "Maxamed Tahliil Xaashi", notaryName: "Deegaan", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 645, name: "Cabdiraxmaan Axmed Shire Guuleed", notaryName: "Dhiblaawe", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 646, name: "Maxamuud Xaaji Jimcaale (Biil)", notaryName: "Dr.Biil", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 647, name: "Cabdishakuur Xasan Cilmi", notaryName: "Furqaan", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 648, name: "Maxamed M.Maxamuud Cumar (Madoobe)", notaryName: "Gacaliye", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 649, name: "Maxamed Maxamuud Ismaaciil", notaryName: "Karaama", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "18 JULY 2024" },
    { id: 650, name: "Maxamed Cali Maxamuud Xeyle", notaryName: "Lafoole", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 651, name: "Liibaan Jimcaale Ibraahim (Islow)", notaryName: "Liibaan", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "18 JULY 2024" },
    { id: 652, name: "Cabdixafiid Maxamed M Maxamuud", notaryName: "Madoobe", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 653, name: "Mahad Xuseen Cali", notaryName: "Maqdas", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 654, name: "Maxamed Mukhtaar Cabdullaahi", notaryName: "Mukhtaar", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 655, name: "Maxamed Cabdifataax Cismaan", notaryName: "Muutaale", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 656, name: "Najiib Cabdi Cali", notaryName: "Najiib", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 657, name: "Cabdullaahi Maxamed Muuse", notaryName: "Ogaal", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "18 JULY 2024" },
    { id: 658, name: "Caamir Cali Maxamuud", notaryName: "Sahan", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "18 JULY 2024" },
    { id: 659, name: "Cabdirisaaq Xasan Xuseen", notaryName: "Shaaciye", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 660, name: "Najiib Xasan Cumar Maxamed", notaryName: "Shabeel", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 661, name: "Xasan Warsame Cali", notaryName: "Suuley", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 662, name: "Xasan Maxamed Cusmaan Cumar", notaryName: "XasanBile", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 663, name: "Zakariye Mahad Diiriye", notaryName: "Xog-Ogaal", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 664, name: "Cabdixakiim Cabdiqaadir Muudey", notaryName: "Zoobe", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "18 JULY 2024" },
    { id: 665, name: "Cabdiraxiim Maxamuud Maxamed", notaryName: "Durdur", district: "Buuhoodle", region: "Togdheer", issueDate: "18 JULY 2024" },
    { id: 666, name: "Cabdi Axmed Cali Geedi", notaryName: "Ummadda", district: "Afgooye Ceelasha Biyaha", region: "Sh Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 667, name: "Ismaaciil Macalin Maxamuud Cali", notaryName: "Salaama", district: "Afgooye Ceelasha Biyaha", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 668, name: "Zakariye Axmed Xasan", notaryName: "Rodol", district: "Boondheere Siinaay", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 669, name: "Kayse Saciid Cartan", notaryName: "Qaaddi", district: "Boondheere Siinaay", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 670, name: "Shaafici Maxamed Axmed Cali", notaryName: "Dulqaad", district: "Boondheere Wadd. Jubba", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 671, name: "Maxamuud Maxamed Cali Cashara", notaryName: "Cashara", district: "Dayniile Daaru-Salaam", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 672, name: "Xaliimo Axmed Faarax Kaariye", notaryName: "Taajir Mulki", district: "Dharkeyley AJabka", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 673, name: "Ibraahim Daahir Xuseen", notaryName: "Rayaan", district: "Dharkeynlay Dabky. Cgaar", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 674, name: "Xaydar Cali Odowaa Cosoble", notaryName: "Odawaa", district: "Dharkeynley Suuq liif", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 675, name: "Daahir Cabdi Maxamuud (Boolis)", notaryName: "Xamar", district: "Dharkeynley AJabka", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 676, name: "Maxamed Cumar Ibraahim", notaryName: "Rasmi Muqdsiho", district: "Dharkeynley Gersh.M Nuur", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 677, name: "Maxamed Sh Axmed Xasan", notaryName: "Hilaal", district: "Dharkeynley Macmacaanka", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 678, name: "Xusseen Maxamed Calasow", notaryName: "Tawakal", district: "Dharkeynley Scd. Rooraaye", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 679, name: "Cabdi Cabdullaahi Abtidoon", notaryName: "Muqdisho", district: "Dharkeynley Scd. Rooraaye", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 680, name: "Cabdirashiid Maxamuud Axmed", notaryName: "Hilaaf", district: "H/wadaaga Isg.Baar Ubax", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 681, name: "Axmed Ciise Guutaale Aden", notaryName: "Qaran", district: "H/wadaaga Jidka Sodonka", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 682, name: "Faadumo Cusmaan Xaaji Ismaaciil", notaryName: "Tagsan", district: "Hoden Isg.Taleex", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 683, name: "Cabdiraxmaan Maxamed Xasan", notaryName: "Qaanuuni", district: "Hoden Isg. Taleex", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 684, name: "Ibraahim Maxamed Axmed", notaryName: "Garsoor", district: "Hoden Isg. Taleex", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 685, name: "Axmed Sh Cali Axmed Buraale", notaryName: "Buraale", district: "Hoden Lmg.Taleex", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 686, name: "Cabdi Axmed Cali (Geedi)", notaryName: "Geedi", district: "Hoden Makka Al-Mukarm.", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 687, name: "Cabdiraxim Ibraahim Macalin", notaryName: "Sadsoor", district: "Hoden Mdx.C/qasim", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 688, name: "Cali Xaaji Maxamed Warsame", notaryName: "Warsame", district: "Hoden Okt. Xaawa Taako", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 689, name: "Maxamed Xuseen Rooble", notaryName: "Dr.Rooble", district: "Hoden Oktober Faanoole", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 690, name: "Guuleed Maxamud Jimcaale Cismaan", notaryName: "Biil", district: "Hoden Zoobe", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 691, name: "Ciise Cabdirahman Maxamed", notaryName: "Fiqi", district: "Hoden Zoone F. KM15", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 692, name: "Cabdikariim Xasan Nuur Maxamed", notaryName: "Aflax", district: "Hoden Zoone F. KM15", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 693, name: "Cabdirisaaq Xasan Cilmi", notaryName: "Kulmiye", district: "Howlwaaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 694, name: "Aadan Jimcaale Maxamed", notaryName: "Dayax", district: "Howlwadaag Baar Ubax", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 695, name: "Cali Yuusuf Xuseen", notaryName: "Xamar", district: "Howlwadaag Jid.Sod. Dallo", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 696, name: "Cabdiraxmaan Xasan Cumar", notaryName: "Soomaaliya", district: "Howlwadaag Shiirkole", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 697, name: "Bashiir Macalim Maxamed Ibraahim", notaryName: "Afrax", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 698, name: "Cabdullaahi Cabdi Xirsi Faarax", notaryName: "Asal", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 699, name: "Aadan Cali Cadow", notaryName: "Hiraabe", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 700, name: "Aadan Cilmi Maxamed (Macalin Aadan)", notaryName: "Hubiye", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 701, name: "Abuubakar Xuseen Maxamed", notaryName: "Dhagajuun", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 702, name: "Axmed Cabdiraxmaan Wehliye Maalin", notaryName: "Wehliye", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 703, name: "Axmed Ciise Cabdullaahi", notaryName: "Banaadir", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 704, name: "Axmed Ismaaciil Barre (Madaxey)", notaryName: "Xaqdhowr", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 705, name: "Cabdiqaadir Xasan Faarax", notaryName: "Al Cadaala", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 706, name: "Cabdiraxmaan Warsame Siyaad", notaryName: "Banaadir", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 707, name: "Cabdirisaaq Maxamed Cabdulle (Tiikey)", notaryName: "Tiikey", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 708, name: "Cabdishakuur Axmed Maxamed Maxamuud", notaryName: "Caddawe", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 709, name: "Cabdullaahi Maxamed Siyaad (Gaab)", notaryName: "Wadani", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 710, name: "Cabdulqaadir Ibraahim Cali", notaryName: "Caalami", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 711, name: "Cali Xaashi Cali Ugaas", notaryName: "Horseed", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 712, name: "Cali Xasan Faarax", notaryName: "Xakiim", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 713, name: "Cartan Cabdisalaam Calasow Dabey", notaryName: "Gardoon", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 714, name: "Ismaaciil Cali Axmed Mahad-Alle", notaryName: "Hubaal", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 715, name: "Ismaacil Maxamed Cabdullaahi", notaryName: "Shahaad", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 716, name: "Maxamed Sh. Axmed Khaliif", notaryName: "Khalifa", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 717, name: "Maxamed Cabdullahi Maxamed Siyaad", notaryName: "Tayo", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 718, name: "Maxamed Cabdulqaadir Sh.Xasan (Amiin)", notaryName: "Amiin", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 719, name: "Maxamed Cali Nuur (Socdaal)", notaryName: "Muqdisho", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 720, name: "Maxamed Ciise Dhowrane", notaryName: "Dhowrane", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 721, name: "Maxamed Yacquub Isaaq Aaden", notaryName: "Xamarcade", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 722, name: "Saciid Cali Cosoble", notaryName: "Muqdisho", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 723, name: "Salaad Maxamed Jaamac", notaryName: "Macruuf", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 724, name: "Yusuf Tuurxume Jimcaale", notaryName: "Tuurxume", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 725, name: "Maxamed Aaden Sheekh Nuur", notaryName: "Qooje", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 726, name: "Saciid Cali Maxamuud", notaryName: "Taakulo", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 727, name: "Muqtaar Macalim Cilmi Maxamed", notaryName: "Bayaan", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 728, name: "Xuseen Maxamuud Muuse", notaryName: "If-ka", district: "Howlwadaaga Suuq Bakaaro", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 729, name: "Xasan Cusmaan Wehliye", notaryName: "Xamari", district: "Kaaraan Boosteejada", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 730, name: "Cabdirashid Cabdullaahi Maxamed", notaryName: "Aw-muuse", district: "Kaaraan Isg.Sanca", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 731, name: "Cabdulqaadir Cabdullaahi Maxamed", notaryName: "Alnuur", district: "Kaaraan Sanca", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 732, name: "Maxamuud Cali Cumar", notaryName: "Biyey", district: "Kaaraan Sanca", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 733, name: "Xasan Dhuxulow Xasan Raage", notaryName: "Dhuxulow", district: "Kaaraan Sanca", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 734, name: "Cali Xasan Cali Nuur", notaryName: "Talasan", district: "Kaaraan Suuq Kaaraan", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 735, name: "Abuubakar Maxamed Suufi Maxamed", notaryName: "Bisle", district: "Kaaraan Wajeer", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 736, name: "Maxamed Sh C/raxman Abuubakar", notaryName: "Badri", district: "Kaaraan Xaliima Hiite", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 737, name: "Cabaas Cabdullaahi Bootaan Sahal", notaryName: "Bootaan", district: "Kaxda Abaadir Farjano", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 738, name: "Maxamuud Aadan Xaashi Jimcaale", notaryName: "Habarwaa", district: "Kaxda Gnrl. Liiqliiqato", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 739, name: "Xasan Aadan Ibraahim Maxamed", notaryName: "Bilaal", district: "Kaxda Shimbiroole", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 740, name: "Xuseen Xasan Cabdulle Cumar", notaryName: "Salmaan", district: "Kaxda Shinbroole", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 741, name: "Idris Maxamed Cusmaan", notaryName: "Waabari", district: "Shibis", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 742, name: "Maxamed Nuur Maxamuud", notaryName: "Diiwaan", district: "Waabari Shaq. Makka", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 743, name: "Sh Axmed Cali Cismaan", notaryName: "Talawadaag", district: "Waabari Hantiwadaag", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 744, name: "Maxamed Cabdi Daahir Colaad", notaryName: "Colaad", district: "Waabari Isg.Dabka", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 745, name: "Xuseen Maxamed Kadiye", notaryName: "Kadiye", district: "Waabari KM4", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 746, name: "Ismaaciil Maxamed Cumar", notaryName: "Saalixi", district: "Waabari KM4", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 747, name: "Maxamed Diiriye Sabriye", notaryName: "Sabriye", district: "Waabari Maaj", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 748, name: "Abuubakar Muumin Axmed", notaryName: "Baana", district: "Waabari Maajo Makka", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 749, name: "Xuseen Cabdi Cilmi", notaryName: "Cilmi", district: "Waabari Shaqaalaha", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 750, name: "Aweys Sheekh Cali Qaasim", notaryName: "Horyaal", district: "Waabari Tree- piano", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 751, name: "Cismaan Maxamed Ismaaciil", notaryName: "Osmaan", district: "Waabari Tree-piano", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 752, name: "Aaden Cabdulqaadir Yaxye", notaryName: "Hufane", district: "Waabari Tree-piano", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 753, name: "Badrudiin Sheekh Rashiid Ibraahiim", notaryName: "Xijaaz", district: "Waabari Tree-piano", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 754, name: "Bashiir Maxamed Sheekh Maxamed", notaryName: "Karaama", district: "Waabari Tree-piano", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 755, name: "Cali Sheekh Cabdi", notaryName: "Ilkadahab", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 756, name: "Yaasiin Cabdi Xasan", notaryName: "Rogaal", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 757, name: "Cabdifitaax Cumar Maxamed", notaryName: "Kaatib", district: "Waabari Tree-piano", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 758, name: "Cabdulqaadir Cumar Kaatib", notaryName: "Kaatib", district: "Waabari Xaaji Baasto", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 759, name: "Cusman Cumar Kaatib", notaryName: "Tahajid", district: "Waabari Xaaji Baasto", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 760, name: "Cabdullaahi Faarax Qaarey", notaryName: "Qaarey", district: "Waabari Xaaji Baasto", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 761, name: "Cumar Maxamed Faarax (Gomed)", notaryName: "Faaruuq", district: "Wadajir KM4", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 762, name: "Cabdiraxman Maxamuud Cali (Time Cade)", notaryName: "Banaadir", district: "Wadajir KM4", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 763, name: "Yoonis Cabdiraxman Maxamud Cali", notaryName: "Bandr. Danuun", district: "Wadajir KM4", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 764, name: "Cabdiraxmaan Daahir Cabdi Booliis", notaryName: "Barako", district: "Wadajir KM4", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 765, name: "Cabdi Aaden Macalin Cabdulle", notaryName: "Mucallim", district: "Wadajir Korontada", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 766, name: "Xuseen Aaden Xasan Yaasiin", notaryName: "Xaydar", district: "Warta-Nabada Jid. Mareexan", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 767, name: "Cabdinaasir Abuukar Xaaji Dheere", notaryName: "Dheere", district: "Warta-Nabada Lab. Dhagex", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 768, name: "Maxamed Maxamuud Maxamed (Dr Luu)", notaryName: "Irmaan", district: "X/Weyne Ex-Shanem Super", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 769, name: "Muumin Axmed Abubakar", notaryName: "Rasmi Xamar", district: "X/Weyne Kacaan Uunlaaye", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 770, name: "Muriidi Muumin Axmed", notaryName: "Rasmi Xamar", district: "X/Weyne Kacaan Uunlaaye", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 771, name: "Cabdinaasir Sh.Cali Jimcaale", notaryName: "Kheyre", district: "X/Weyne Kacaan Uunlaaye", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 772, name: "Cabdiqadir Sheekh Cabdiwahab Maxamed", notaryName: "Cabdiwahaab", district: "X/Weyne Via Roma", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 773, name: "Cabdulwahaab Nuur Mahdi", notaryName: "Kulan", district: "X/Weyne Via Roma", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 774, name: "Maxamed Xaaji Shiikhey Abati", notaryName: "Alfaqi", district: "X/Weyne Via Roma", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 775, name: "Yaasiin Axmed Cusmaan", notaryName: "Al-Aamin", district: "X/Weyne Via Roma", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 776, name: "Cabdifataax Cabdisamad Cabdiraxmaan", notaryName: "Shaahid", district: "X/Weyne Via Roma", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 777, name: "Cali Abuukar Xaayow", notaryName: "Cali Marduuf", district: "Xamarweyne Muqd.Mall", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 778, name: "Cabdullaahi Xasan Wehliye", notaryName: "Qalam", district: "Xamarweyne Muqd.Mall", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 779, name: "Maxamed Ibraahim Maxamed Cali", notaryName: "Muqdisho", district: "Yaaqshid Daaru-Salaam", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 780, name: "Xassan Sh. Maxamed Farxaan", notaryName: "Muqdisho- Studio legale", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 781, name: "Cabdifataax Axmed Cabdulle Kulan", notaryName: "Kaamil", district: "Yaaqshid 4 Tarjiino", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 782, name: "Cabdisalaan Cabdiraxmaan Caafi Cabdulle", notaryName: "Caafi", district: "Yaaqshid Daaru-Salaam", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 783, name: "Cumar Cabdi Cadaawe", notaryName: "Suldaan", district: "Yaaqshid Daaru-Salaam", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 784, name: "Feysal Maxamed Maxamuud", notaryName: "Mustaqbal", district: "Yaaqshid Daaru-Salaam", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 785, name: "Maxamed Cabdi Maxamed Xuseen", notaryName: "Gurmad", district: "Yaaqshid Daaru-Salaam", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 786, name: "Xasan Maxamed Axmed (Sunni)", notaryName: "Sunni", district: "Yaaqshid Daaru-Salaam", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 787, name: "Cismaan Cabdulle Cabdi Cisman (Jeelle)", notaryName: "Al-Taqwa", district: "Yaaqshid Daaru-Salaam", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 788, name: "Cumar Cali Maxamuud Cawaale", notaryName: "Cali-Agoon", district: "Yaaqshid Daru-Salaam", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 789, name: "Daahir Maxamuud Maxamed", notaryName: "Xamar", district: "Yaaqshid Daru-Salaam", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 790, name: "Abuubakar Yusuf Wardheere", notaryName: "Wardheere", district: "Yaaqshid Ex-Control Balcad", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 791, name: "Cismaan Cadceed Cismaan Shuuriye", notaryName: "Shuuriye", district: "Yaaqshid Ex-Suq. Xoolaha", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 792, name: "Maxamed Nuur Maxmed Cali", notaryName: "Baxnaan", district: "Yaaqshid Ex-Suuq Xoolaha", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 793, name: "Xasan Maxamed Cali Barrow", notaryName: "Barrow", district: "Yaaqshid Horseed", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 794, name: "Nuur Cali Culusow Geedi", notaryName: "Culusow", district: "Yaaqshid Horseed", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 795, name: "Cabdiraxman Sh Maxamed Xasan", notaryName: "Alxarameyn", district: "Yaaqshid Siinaay", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 796, name: "Maxamed Cismaan Wehliye", notaryName: "Salaam Muqdisho", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 797, name: "Cabdi Cadaawe Cali", notaryName: "Ex-Banaadir", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 798, name: "Cabdi Yuusuf Xasan Maahir", notaryName: "Maahir", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 799, name: "Cabdiraxmaan Xuseen Maxamuud", notaryName: "Timo-weyne", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 800, name: "Cabdiwali Xasan Culusow Cali", notaryName: "Al-faraj", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 801, name: "Cali Macalin Xasan Maxamuud", notaryName: "Kalsan", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 802, name: "Daahir Xaaji Xasan Axmed", notaryName: "Waano", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 803, name: "Maxamed Xuseen Xasan", notaryName: "Talawadaag", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 804, name: "Maxamed Cabdullaahi Hagar Maxamuud", notaryName: "Balli", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 805, name: "Qaasim Maxamed Ibrahim Barrow", notaryName: "Qaasimmi", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 806, name: "Aweys Ibraahim Xuseen", notaryName: "Aweis", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 807, name: "Ibrahim Xasan Sheekh Xuseen", notaryName: "Towfiiq", district: "Yaaqshid Towfiiq", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 808, name: "Muxuyadiin Xasan Maxamed", notaryName: "Azhari", district: "Yaaqshid Towfiiq", region: "Banaadir", issueDate: "10 DECEMBER 2022" },
    { id: 809, name: "Maxamed Mukhtaar Cabdullaahi", notaryName: "Mukhtaar", district: "Yaaqshid Towfiiq", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 810, name: "Abuubakar Jeylaani Sh. Abuukar (Wakiil)", notaryName: "Al-Falax", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 811, name: "Axmed Xasan Shidane", notaryName: "Daaru Salaam", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 812, name: "Cabaas Cabdiraxmaan Maxamuud", notaryName: "Al-Cabasiyah", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 813, name: "Cabdiraxmaan Axmed Shire Guuleed", notaryName: "Dhiblaawe", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 814, name: "Cabdirisaaq Xasan Xuseen", notaryName: "Shaaciye", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 815, name: "Cabdishakuur Xasan Cilmi", notaryName: "Furqaan", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 816, name: "Cabdixakiim Cabdiqaadir Muudey", notaryName: "Zoobe", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 817, name: "Cabdullaahi Maxamed Muuse", notaryName: "Ogaal", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 818, name: "Cali Maxamuud Jimcaale", notaryName: "Cali Biil", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 819, name: "Feysal Cabdirashiid Axmed", notaryName: "Damal", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 820, name: "Haashim Maxamed Yusuf (Kabaqori)", notaryName: "Kabaqori", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 821, name: "Liibaan Jimcaale Ibraahim (Islow)", notaryName: "Liibaan", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 822, name: "Maxamed Cabdi Axmed (Kalajaban)", notaryName: "Hiigsi", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 823, name: "Maxamed Cabdifataax Cismaan", notaryName: "Muutaale", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 824, name: "Maxamed Cali Maxamuud Xeyle", notaryName: "Lafoole", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 825, name: "Maxamed M.Maxamuud Cumar (Madoobe)", notaryName: "Gacaliye", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 826, name: "Maxamed Xaaji Jimcaale (Biil)", notaryName: "Dr Biil", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 827, name: "Najiib Xasan Cumar Maxamed", notaryName: "Shabeel", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 828, name: "Xasan Warsame Cali", notaryName: "Suuley", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 829, name: "Liibaan Cismaan Aaden Axmed", notaryName: "Bader", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 830, name: "Maxamed Maxamuud Ismaaciil", notaryName: "Karaama", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 831, name: "Caamir Cali Maxamuud", notaryName: "Sahan", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 832, name: "Aadam Maxamed Carmo", notaryName: "Carmoole", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 833, name: "Cabdullaahi Bashiir Maxamed", notaryName: "Ex-Moqdisho", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 834, name: "Saciid Maxamuud Gabow", notaryName: "Gabow", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 835, name: "Axmed Yaxye Maxamed", notaryName: "Bakooraan", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 836, name: "Maxamed Cali Ibraahim", notaryName: "Hareeri", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 837, name: "Iqra Yuusuf Ibraahim", notaryName: "Sooyaal", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 838, name: "Cali Saalax Cabdulle", notaryName: "Saalax Cirro", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 839, name: "Cismaan Xasan Cabdi", notaryName: "Cismaan Dheere", district: "Afgooye Ceelasha", region: "Sh Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 840, name: "Yaxya Maxamuud Maxamed", notaryName: "Kaaykaay", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 841, name: "Maxamed Cali Nuur", notaryName: "Barqadle", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 842, name: "Maxamed Tahliil Xaashi", notaryName: "Deegaan", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 843, name: "Najiib Cabdi Cali", notaryName: "Najiib", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 844, name: "Calinaasir Aaden Jimcaale", notaryName: "Diyaar", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 845, name: "Mahad Xuseen Cali", notaryName: "Maqdas", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 846, name: "Cabdixafiid Maxamed M Maxamuud", notaryName: "Madoobe", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 847, name: "Liibaan Cabdullaahi Muumin", notaryName: "Liibaan", district: "Afgooye Ceelasha", region: "Hiiraan", issueDate: "10 DECEMBER 2022" },
    { id: 848, name: "Maxamed Cusmaan Ibraahim", notaryName: "Caddaala", district: "Baladweyne", region: "Hiiraan", issueDate: "10 DECEMBER 2022" },
    { id: 849, name: "Cabdullaahi Muxudiin Xasan", notaryName: "Barkulan", district: "Baladweyne", region: "Sh Dhexe", issueDate: "10 DECEMBER 2022" },
    { id: 850, name: "Daahir Cilmi Cali (Mucallim. Daahir)", notaryName: "Waayeel", district: "Balcad", region: "Sh Dhexe", issueDate: "10 DECEMBER 2022" },
    { id: 851, name: "Maxamed Cilmi Maxamed", notaryName: "Bulsho", district: "Balcad", region: "Sh Dhexe", issueDate: "10 DECEMBER 2022" },
    { id: 852, name: "Bilaal Xamsa Maxamed", notaryName: "Jamhuuriya", district: "Balcad", region: "Sh Dhexe", issueDate: "10 DECEMBER 2022" },
    { id: 853, name: "Aadan Ibraahim Buule", notaryName: "Koonf Galbeed", district: "Balcad", region: "Baay", issueDate: "10 DECEMBER 2022" },
    { id: 854, name: "Khadiijo Axmed Muudey", notaryName: "Muudey", district: "Baydhabo", region: "Baay", issueDate: "10 DECEMBER 2022" },
    { id: 855, name: "Maxamed Cabdiraxmaan Aadan", notaryName: "Daacad", district: "Baydhabo", region: "Baay", issueDate: "10 DECEMBER 2022" },
    { id: 856, name: "Xuseen Isgoowe Xuseen (Xaqsoor)", notaryName: "Xaqsoor", district: "Baydhabo", region: "Baay", issueDate: "10 DECEMBER 2022" },
    { id: 857, name: "Cabdirisaaq Yacquub Xasan", notaryName: "Marwaaz", district: "Baydhabo", region: "Baay", issueDate: "10 DECEMBER 2022" },
    { id: 858, name: "Cabdullaahi Sh Ibraahim Aadan (Xaydar)", notaryName: "Arlaadi", district: "Baydhabo", region: "Baay", issueDate: "10 DECEMBER 2022" },
    { id: 859, name: "Ibraahim Maxamed Cali", notaryName: "Manhal", district: "Baydhabo", region: "Baay", issueDate: "10 DECEMBER 2022" },
    { id: 860, name: "Cabdiraxiim Maxamuud Maxamed", notaryName: "Durdur", district: "Baydhabo", region: "Togdheer", issueDate: "10 DECEMBER 2022" },
    { id: 861, name: "Xasan Maxamed Xalane", notaryName: "Buuloburta", district: "Buuhoodle", region: "Hiiraan", issueDate: "10 DECEMBER 2022" },
    { id: 862, name: "Cabdigargaar Axmed Xaashi", notaryName: "Gargaar", district: "Buuloburta", region: "Galgaduud", issueDate: "10 DECEMBER 2022" },
    { id: 863, name: "Cabdinaasir Maxamed Xasan", notaryName: "Al-hudaa", district: "Cabudwaaq", region: "Galgaduud", issueDate: "10 DECEMBER 2022" },
    { id: 864, name: "Xasan Cabdi Tahliil", notaryName: "Kaah", district: "Cabudwaaq", region: "Galgaduud", issueDate: "10 DECEMBER 2022" },
    { id: 865, name: "Daahir Xasan Faarax", notaryName: "Januune", district: "Cabudwaaq", region: "Galgaduud", issueDate: "10 DECEMBER 2022" },
    { id: 866, name: "Bashiir Xuseen Maxamed", notaryName: "Hanaano", district: "Dhuusamareeb", region: "Galgaduud", issueDate: "10 DECEMBER 2022" },
    { id: 867, name: "Cabdulqaadir Cali Mire", notaryName: "Cali Mire", district: "Dhuusamareeb", region: "Galgaduud", issueDate: "10 DECEMBER 2022" },
    { id: 868, name: "Cabdullaahi Cali Maxamed", notaryName: "Towfiiq", district: "Dhuusamareeb", region: "Mudug Glg", issueDate: "10 DECEMBER 2022" },
    { id: 869, name: "Yuusuf Cabdisalaam Warsame", notaryName: "Geeska Afrika", district: "Gaalgacyo", region: "Mudug Pld", issueDate: "10 DECEMBER 2022" },
    { id: 870, name: "Muhayadiin Cabdikariin Maxamed", notaryName: "Gaalkacyo", district: "Gaalgacyo", region: "Mudug", issueDate: "10 DECEMBER 2022" },
    { id: 871, name: "Saciid Cabdullaahi Cabdi", notaryName: "Garawe", district: "Gaalkacyo", region: "Nugaal", issueDate: "10 DECEMBER 2022" },
    { id: 872, name: "Xabiib Maxamed Kulmiye", notaryName: "Jubba", district: "Garawe", region: "Jub.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 873, name: "Xasan Maxamed Nuur", notaryName: "Abuuraas", district: "Kismaayo", region: "Jub.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 874, name: "Ismaaciil Xasan Wehliye", notaryName: "Wehliye", district: "Kismaayo", region: "Jub.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 875, name: "Cabdulxakiim Shaafi Yuusuf", notaryName: "Shaafi", district: "Kismaayo", region: "Jub.Hoose", issueDate: "10 DECEMBER 2022" },
    { id: 876, name: "Aadan Jimcaale Maxamed", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 877, name: "Aaden Cabdulqaadir Yaxye", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 878, name: "Abuubakar Yusuf Wardheere", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 879, name: "Axmed Ciise Cabdullaahi", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 880, name: "Axmed Sh Cali Axmed Buraale", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 881, name: "Bashiir Maxamed Sheekh Maxamed", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 882, name: "Cabdi Aaden Macalin Cabdulle", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 883, name: "Cabdi Axmed Cali (Geedi)", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 884, name: "Cabdi Cabdullaahi Abtidoon", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 885, name: "Cabdi Cadaawe Cali", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 886, name: "Cabdi Yuusuf Xasan Maahir", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 887, name: "Cabdifitaax Cumar Maxamed", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 888, name: "Cabdinaasir Abuukar Xaaji Dheere", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 889, name: "Cabdinaasir Sh.Cali Jimcaale", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 890, name: "Cabdirashid Cabdullaahi Maxamed", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 891, name: "Cabdirashiid Cabdullaahi Maxamuud", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 892, name: "Cabdiraxmaan Warsame Siyaad", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 893, name: "Cabdiraxman Maxamuud Cali (Time Cade)", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 894, name: "Cabdirisaaq Maxamed Cabdulle (Tiikey)", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 895, name: "Cabdirisaaq Xasan Cilmi", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 896, name: "Cabdullaahi Faarax Qaarey", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 897, name: "Cabdulqaadir Cabdullaahi Maxamed", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 898, name: "Cabdulqaadir Cumar Kaatib", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 899, name: "Cabdulqaadir Yalaxow Hiraabe", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 900, name: "Cabdulwaaxid Maxamed Xuseen (Wakiil)", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 901, name: "Cabdulwahaab Nuur Mahdi", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 902, name: "Cali Maxamuud Jimcaale", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 903, name: "Cali Sheekh Cabdi", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 904, name: "Cali Xaashi Cali Ugaas", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 905, name: "Cali Xasan Faarax", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 906, name: "Cali Yuusuf Xuseen", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 907, name: "Ciise Cabdirahman Maxamed", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 908, name: "Cismaan Maxamed Ismaaciil", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 909, name: "Cumar Maxamed Farax (Gomed)", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 910, name: "Daahir Cabdi Maxamuud (Boolis)", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 911, name: "Daahir Maxamuud Maxamed", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 912, name: "Daahir Xaaji Xasan Axmed", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 913, name: "Deeq Cabdi Rayid", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 914, name: "Ibraahim Maxamed Axmed", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 915, name: "Ibrahim Xasan Sheekh Xuseen", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 916, name: "Idris Maxamed Cusmaan", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 917, name: "Ismaacil Maxamed Cabdullaahi", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 918, name: "Khalif Sh Ibraahim Dhiblaawe", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 919, name: "Maxamed Diiriye Sabriye", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 920, name: "Maxamed Sh. Axmed Khaliif", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 921, name: "Maxamed Xuseen Xasan", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 922, name: "Maxamed Cabdulqaadir Sh. Xasan (Amiin)", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 923, name: "Maxamed Cali Nuur (Socdaal)", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    { id: 924, name: "Maxamed Cumar Ibraahim", notaryName: "MA LAHAN", district: "MA LAHAN", region: "Banaadir", issueDate: "5 August 2020" },
    {
        id: 925,
        name: "Maxamed Ibraahim Maxamed Cali",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 926,
        name: "Maxamed Sh Axmed Xasan",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 927,
        name: "Maxamed Sh C/raxman Abuubakar",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 928,
        name: "Maxamed Xaaji Jimcaale (Biil)",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 929,
        name: "Maxamed Xaaji Shiikhey Abati",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 930,
        name: "Maxamuud Axmed Xasan (Dalab)",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 931,
        name: "Maxamuud Cali Cumar",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 932,
        name: "Muriidi Muumin Axmed",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 933,
        name: "Muumin Axmed Abubakar",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 934,
        name: "Muxuyadiin Xasan Maxamed",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 935,
        name: "Saciid Cali Cosoble",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 936,
        name: "Saciid Cali Maxamuud",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 937,
        name: "Sh Axmed Cali Cismaan",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 938,
        name: "Sh Cabdi limaan Cumar",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 939,
        name: "Xasan Maxamed Axmed (Suni)",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 940,
        name: "Xassan Sh. Maxamed Farxaan",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 941,
        name: "Xuseen Aaden Xasan Yaasiin",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 942,
        name: "Xuseen Maxamuud Muuse",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 943,
        name: "Xusseen Maxamed Calasow",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 944,
        name: "Yaasiin Cabdi Xasan",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 945,
        name: "Yoonis Cabdiraxman Maxamud Cali",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 946,
        name: "Yusuf Tuurxume Jimcaale",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 947,
        name: "Maxamed Maxamuud Maxamed (Dr Luu)",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 948,
        name: "Xuseen Xasan Cali",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 949,
        name: "Abubakar Maxamed Suufi Maxamed",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 950,
        name: "Cabdiraxmaan Maxamed Xasan Ibraahim",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 951,
        name: "Cali Macalin Xasan Maxamuud",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 952,
        name: "Cabdishakuur Axmed Maxamed Maxam,ud",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 953,
        name: "Maxamed Aadan Cismaan Jimcaale",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 954,
        name: "Aweys Sheekh Cali Qaasim",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 955,
        name: "Cismaan Cadceed Cismaan Shuuriye",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 956,
        name: "Maxamed Cabdifataax Cismaan",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 957,
        name: "Axmed Cabdiraxmaan Wehliye Maalin",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 958,
        name: "Maxamed Cismaan Wehliye",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 959,
        name: "Cabdi Axmed Cali Geedi",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 960,
        name: "Maxamed Cabdi Maxamed Xuseen",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 961,
        name: "Maxamuud Aadan Xaashi Jimcaale",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 962,
        name: "Maxamed Cabdullaahi Hagar Maxamuud",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 963,
        name: "Xasan Aadan Ibraahim Maxamed",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 964,
        name: "Maxamed Yacquub Isaaq Aaden",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 965,
        name: "Ismaaciil Macalin Maxamuud Cali",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 966,
        name: "Maxamuud Maxamed Cali Cashara",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "5 August 2020"
    },
    {
        id: 967,
        name: "Xuseen Isgoowe Xuseen (Xaqsoor)",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Gobolka Bay-Baydhabo",
        issueDate: "5 August 2020"
    },
    {
        id: 968,
        name: "Liibaan Cabdullaahi Muumin",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Gobolka Hiiraan-B/weyne",
        issueDate: "5 August 2020"
    },
    {
        id: 969,
        name: "Maxamed Cusmaan Ibraahim",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Gobolka Hiiraan-B/weyne",
        issueDate: "5 August 2020"
    },
    {
        id: 970,
        name: "Xasan Maxamed Xalane",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Gobolka Hiiraan-Buuloburde",
        issueDate: "5 August 2020"
    },
    {
        id: 971,
        name: "Saciid Cabdullaahi Cabdi",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Gobolka Nugaal-Garawe",
        issueDate: "5 August 2020"
    },
    {
        id: 972,
        name: "Maxamed M.Maxamuud Cumar (Madoobe)",
        notaryName: "MA LAHAN",
        district: "MA LAHAN",
        region: "Gobolka Sh. Hoose-Afgooye",
        issueDate: "5 August 2020"
    },
    {
        id: 973,
        name: "Aadan Cilmi Maxamed",
        notaryName: "Hufane",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 974,
        name: "Aadan Jimcaale Maxamed",
        notaryName: "Hubiye",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 975,
        name: "Aaden Cabdulqaadir Yaxye",
        notaryName: "Dayax",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 976,
        name: "Abuubakar Maxamed Suufi Maxamed",
        notaryName: "Suufi",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 977,
        name: "Abuubakar Yusuf Wardheere",
        notaryName: "Wardheere",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 978,
        name: "Aweys Sheekh Cali Qaasim",
        notaryName: "Horyaal",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 979,
        name: "Axmed Cabdiraxmaan Wehliye Maalin",
        notaryName: "Wehliye",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 980,
        name: "Axmed Ciise Cabdullaahi",
        notaryName: "[No Notary Name Provided]",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 981,
        name: "Axmed Ismaaciil Barre (Madaxey)",
        notaryName: "Banaadir",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 982,
        name: "Axmed Sh Cali Axmed Buraale",
        notaryName: "Xaqdhowr",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 983,
        name: "Badrudiin Sheekh Rashiid Ibraahiim",
        notaryName: "Buraale",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 984,
        name: "Bashiir Maxamed Sheekh Maxamed",
        notaryName: "Xijaaz",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 985,
        name: "Cabdi Aaden Macalin Cabdulle",
        notaryName: "Karaama",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 986,
        name: "Cabdi Axmed Cali (Geedi)",
        notaryName: "Mucalim",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 987,
        name: "Cabdi Axmed Cali Geedi",
        notaryName: "Geedi",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 988,
        name: "Cabdi Cabdullaahi Abtidoon",
        notaryName: "Ummadda",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 989,
        name: "Cabdi Cadaawe Cali",
        notaryName: "Muqdisho Abtidoon",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 990,
        name: "Cabdi Yuusuf Xasan Maahir",
        notaryName: "Maahir",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 991,
        name: "Cabdifitaax Cumar Maxamed",
        notaryName: "[No Notary Name Provided]",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 992,
        name: "Cabdinaasir Abuukar Xaaji Dheere",
        notaryName: "Kaatib",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 993,
        name: "Cabdinaasir Sh.Cali Jimcaale",
        notaryName: "Dheere",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 994,
        name: "Cabdirashid Cabdullaahi Maxamed",
        notaryName: "Khayre Muqdisho",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 995,
        name: "Cabdiraxmaan Maxamed Xasan Ibraahim",
        notaryName: "Awmuuse",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 996,
        name: "Cabdiraxmaan Warsame Siyaad",
        notaryName: "Qaanuuni",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 997,
        name: "Cabdiraxman Maxamuud Cali (Time Cade)",
        notaryName: "Banaadir Time cade",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 998,
        name: "Cabdirisaaq Maxamed Cabdulle (Tiikey)",
        notaryName: "Tiikey",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 999,
        name: "Cabdirisaaq Xasan Cilmi",
        notaryName: "Kulmiye",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1000,
        name: "Cabdisalaan Cabdiraxmaan Caafi Cabdulle",
        notaryName: "Caafi",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1001,
        name: "Cabdishakuur Axmed Maxamed Maxam,ud",
        notaryName: "Caddawe",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1002,
        name: "Cabdullaahi Maxamed Siyaad (Gaab)",
        notaryName: "Wadani",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1003,
        name: "Cabdulqaadir Cabdullaahi Maxamed",
        notaryName: "Alnuur",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1004,
        name: "Cabdulqaadir Cumar Kaatib",
        notaryName: "Kaatib",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1005,
        name: "Cabdulwaaxid Maxamed Xuseen (Wakiil)",
        notaryName: "[No Notary Name Provided]",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1006,
        name: "Cabdulwahaab Nuur Mahdi",
        notaryName: "Cilmi",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1007,
        name: "Cali Macalin Xasan Maxamuud",
        notaryName: "Kulan",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1008,
        name: "Cali Maxamuud Jimcaale",
        notaryName: "Kalsan",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1009,
        name: "Cali Sheekh Cabdi",
        notaryName: "Ilkadahab",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1010,
        name: "Cali Xaashi Cali Ugaas",
        notaryName: "Horseed",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1011,
        name: "Cali Xasan Faarax",
        notaryName: "Xakiim",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1012,
        name: "Cali Yuusuf Xuseen",
        notaryName: "Xamar-Xamarweyne",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1013,
        name: "Ciise Cabdirahman Maxamed",
        notaryName: "Fiqi",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1014,
        name: "Cismaan Cadceed Cismaan Shuuriye",
        notaryName: "Shuuriye",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1015,
        name: "Cismaan Maxamed Ismaaciil",
        notaryName: "Osmaan",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1016,
        name: "Cumar Maxamed Faarax (Gomed)",
        notaryName: "Faaruuq",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1017,
        name: "Daahir Cabdi Maxamuud (Boolis)",
        notaryName: "Xamar-Dharkeynley",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1018,
        name: "Daahir Maxamuud Maxamed",
        notaryName: "Xamar-Suuqxoolaha",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1019,
        name: "Daahir Xaaji Xasan Axmed",
        notaryName: "Waano",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1020,
        name: "Deeq Cabdi Rayid",
        notaryName: "Hilaac",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1021,
        name: "Ibraahim Maxamed Axmed",
        notaryName: "Garsoor",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1022,
        name: "Ibrahim Xasan Sheekh Xuseen",
        notaryName: "Towfiiq",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1023,
        name: "Idris Maxamed Cusmaan",
        notaryName: "Waabari",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1024,
        name: "Ismaaciil Macalin Maxamuud Cali",
        notaryName: "Salaama",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1025,
        name: "Ismaacil Maxamed Cabdullaahi",
        notaryName: "Shahaad",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1026,
        name: "Khalif Sh Ibraahim Dhiblaawe",
        notaryName: "Dhiblaawe",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1027,
        name: "Maxamed Diiriye Sabriye",
        notaryName: "Sabriye",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1028,
        name: "Maxamed Sh. Axmed Khaliif",
        notaryName: "Khalifa",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1029,
        name: "Maxamed Xuseen Xasan",
        notaryName: "Talawadaag - Kaaraan",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1030,
        name: "Maxamed Cabdi Maxamed Xuseen",
        notaryName: "Gurmad",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1031,
        name: "Maxamed Cabdifataax Cismaan",
        notaryName: "Muutaale",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1032,
        name: "Maxamed Cabdullaahi Hagar Maxamuud",
        notaryName: "Balli",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1033,
        name: "Maxamed Cabdulqaadir Sh.Xasan (Amiin)",
        notaryName: "Amiin",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1034,
        name: "Maxamed Cali Nuur (Socdaal)",
        notaryName: "Socdaal Muqdisho",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1035,
        name: "Maxamed Cismaan Wehliye",
        notaryName: "Salaam Muqdisho",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1036,
        name: "Maxamed Cumar Ibraahim",
        notaryName: "Rasmi Muqdsiho",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1037,
        name: "Maxamed Ibraahim Maxamed Cali",
        notaryName: "Sh Ibraahim",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1038,
        name: "Maxamed Maxamuud Maxamed (Dr Luu)",
        notaryName: "Irmaan",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1039,
        name: "Maxamed Sh Axmed Xasan",
        notaryName: "Hilaal",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1040,
        name: "Maxamed Xaaji Jimcaale (Biil)",
        notaryName: "Dr Biil",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1041,
        name: "Maxamed Xaaji Shiikhey Abati",
        notaryName: "Alfaqi",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1042,
        name: "Maxamed Yacquub Isaaq Aaden",
        notaryName: "Xamarcade",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1043,
        name: "Maxamuud Maxamed Cali Cashara",
        notaryName: "Cashara",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1044,
        name: "Maxamuud Aadan Xaashi Jimcaale",
        notaryName: "Habarwaa",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1045,
        name: "Maxamuud Cali Cumar",
        notaryName: "Biyey",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1046,
        name: "Muriidi Muumin Axmed",
        notaryName: "Rasmi Xamar",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1047,
        name: "Muumin Axmed Abubakar",
        notaryName: "Rasmi Xamar",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1048,
        name: "Muxuyadiin Xasan Maxamed",
        notaryName: "Azhari",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1049,
        name: "Saciid Cali Cosoble",
        notaryName: "Muqdisho",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1050,
        name: "Saciid Cali Maxamuud",
        notaryName: "Taakulo",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1051,
        name: "Sh Axmed Cali Cismaan",
        notaryName: "Talawadaag-Waabari",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1052,
        name: "Sh Cabdi Iimaan Cumar",
        notaryName: "Siisi",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1053,
        name: "Xasan Aadan Ibraahim Maxamed",
        notaryName: "Bilaal",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1054,
        name: "Xasan Maxamed Axmed (Suni)",
        notaryName: "Suni",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1055,
        name: "Xassan Sh. Maxamed Farxaan",
        notaryName: "Muqdisho- Studio legale",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1056,
        name: "Xuseen Aaden Xasan Yaasiin",
        notaryName: "Xeyder",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1057,
        name: "Xuseen Maxamuud Muuse",
        notaryName: "Ifka",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1058,
        name: "Xusseen Maxamed Calasow",
        notaryName: "Tawakal",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1059,
        name: "Yaasiin Cabdi Xasan",
        notaryName: "Rogaal",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1060,
        name: "Yusuf Tuurxume Jimcaale",
        notaryName: "Tuurxume",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1061,
        name: "Xasan Cusmaan Wehliye",
        notaryName: "Xamari",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1062,
        name: "Cali Xaaji Maxamed Warsame",
        notaryName: "Warsame",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1063,
        name: "Cabdiraxmaan Xuseen Maxamuud Maxamed",
        notaryName: "Timaweyne",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1064,
        name: "Maxamed Cabdullahi Maxamed Siyaad",
        notaryName: "Tayo",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1065,
        name: "Cali Xasan Cali Nuur",
        notaryName: "Talasan",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1066,
        name: "Xaliimo Axmed Faarax Kaariye",
        notaryName: "Taajir Mulki",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1067,
        name: "Cumar Cabdi Cadaawe",
        notaryName: "Suldaan",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1068,
        name: "Cabdiraxim Ibraahim Macalin",
        notaryName: "Sadsoor",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1069,
        name: "Ismaaciil Maxamed Cumar",
        notaryName: "Saalixi",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1070,
        name: "Zakariye Axmed Xasan",
        notaryName: "Rodol",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1071,
        name: "Ibraahim Daahir Xuseen",
        notaryName: "Rayaan",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1072,
        name: "Qaasim Maxamed Ibrahim Barrow",
        notaryName: "Qaasimi",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1073,
        name: "Xaydar Cali Odowaa Cosoble",
        notaryName: "Odawaa",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1074,
        name: "Feysal Maxamed Maxamuud",
        notaryName: "Mustaqbal",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1075,
        name: "Salaad Maxamed Jaamac",
        notaryName: "Macruuf",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1076,
        name: "Xuseen Maxamed Kadiye",
        notaryName: "Kadiye",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1077,
        name: "Ismaaciil Cali Axmed Mahad-Alle",
        notaryName: "Hubaal",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1078,
        name: "Cartan Cabdisalaam Calasow Dabey",
        notaryName: "Gadroon",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1079,
        name: "Maxamed Nuur Maxamuud",
        notaryName: "Diiwaan",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1080,
        name: "Xasan Dhuxulow Xasan Raage",
        notaryName: "Dhuxulow",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1081,
        name: "Maxamed Ciise Dhowrane",
        notaryName: "Dhowrane",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1082,
        name: "Abuubakar Xuseen Maxamed",
        notaryName: "Dhagajuun",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1083,
        name: "Cabaas Cabdullaahi Bootaan Sahal",
        notaryName: "Bootaan",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1084,
        name: "Muqtaar Macalim Cilmi Maxamed",
        notaryName: "Bayaan",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1085,
        name: "Maxamed Nuur Maxmed Cali",
        notaryName: "Baxnaan",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1086,
        name: "Xasan Maxamed Cali Barrow",
        notaryName: "Barrow",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1087,
        name: "Cabdiraxmaan Daahir Cabdi Booliis",
        notaryName: "Barako",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1088,
        name: "Abuubakar Muumin Axmed",
        notaryName: "Baana",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1089,
        name: "Aweys Ibraahim Xuseen",
        notaryName: "Aweis",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1090,
        name: "Cabdullaahi Cabdi Xirsi Faarax",
        notaryName: "Asal",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1091,
        name: "Cabdiraxman Sheekh Maxamed Xasan",
        notaryName: "Alxarameyn",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1092,
        name: "Cismaan Cabdulle Cabdi Cisman",
        notaryName: "Al-Taqwa",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1093,
        name: "Cabdiwali Xasan Culusow Cali",
        notaryName: "Alfaraj",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1094,
        name: "Cabdiqaadir Xasan Faarax",
        notaryName: "Al Cadaala",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1095,
        name: "Bashiir Macalim Maxamed Ibraahim",
        notaryName: "Afrax",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1096,
        name: "Cabdikariim Xasan Nuur Maxamed",
        notaryName: "Aflax",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1097,
        name: "Axmed Ciise Guutaale Aden",
        notaryName: "Qaran",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1098,
        name: "Cabdifataax Axmed Cabdulle Kulan",
        notaryName: "Kaamil",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1099,
        name: "Cabdiqadir Sheekh Cabdiwahab Maxamed",
        notaryName: "Cabdiwahaab",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1100,
        name: "Cabdullaahi Xasan Wehliye",
        notaryName: "Al-faraj",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1101,
        name: "Cumar Cali Maxamuud Cawaale",
        notaryName: "Cali-Agoon",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1102,
        name: "Cusman Cumar Kaatib",
        notaryName: "Tahajid",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1103,
        name: "Faadumo Cusmaan Xaaji Ismaaciil",
        notaryName: "[No Notary Name Provided]",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1104,
        name: "Guleed Maxamud Jimcaale Cismaan",
        notaryName: "Tagsan",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1105,
        name: "Maxamed Cabdi Daahir Colaad",
        notaryName: "Colaad",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1106,
        name: "Maxamed Cabdullaahi Cusmaan Yabarow",
        notaryName: "Ducaale",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1107,
        name: "Nuur Cali Culusow Geedi",
        notaryName: "Culusow",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1108,
        name: "Shaafici Maxamed Axmed Cali",
        notaryName: "[No Notary Name Provided]",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1109,
        name: "Xuseen Xasan Cabdulle Cumar",
        notaryName: "Dulqaad",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1110,
        name: "Yaasiin Axmed Cusmaan",
        notaryName: "Salmaan",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1111,
        name: "Cabdullaahi Faarax Qaarey",
        notaryName: "Qaarey",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1112,
        name: "Yoonis Cabdiraxman Maxamud Cali",
        notaryName: "Qaarey",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1113,
        name: "Maxamed Cabdiraxmaan Aadan",
        notaryName: "Banaadir Danuun",
        district: "MA LAHAN",
        region: "Banaadir",
        issueDate: "15 August 2021"
    },
    {
        id: 1114,
        name: "Xuseen Isgoowe Xuseen (Xaqsoor)",
        notaryName: "Daacad",
        district: "MA LAHAN",
        region: "Gobolka Bay-Baydhabo",
        issueDate: "15 August 2021"
    },
    {
        id: 1115,
        name: "Cabdigargaar Axmed Xaashi",
        notaryName: "Xaqsoor",
        district: "MA LAHAN",
        region: "Gobolka Bay-Baydhabo",
        issueDate: "15 August 2021"
    },
    {
        id: 1116,
        name: "Cabdinaasir Maxamed Xasan",
        notaryName: "Gargaar",
        district: "MA LAHAN",
        region: "Gobolka Galgaduud-Cabudwaaq",
        issueDate: "15 August 2021"
    },
    {
        id: 1117,
        name: "Maxamed Xuseen Rooble",
        notaryName: "Al-hudaa",
        district: "MA LAHAN",
        region: "Gobolka Galgaduud- Cabudwaaq",
        issueDate: "15 August 2021"
    },
    {
        id: 1118,
        name: "Liibaan Cabdullaahi Muumin",
        notaryName: "Liibaan",
        district: "MA LAHAN",
        region: "Gobolka Hiiraan-B/weyne",
        issueDate: "15 August 2021"
    },
    {
        id: 1119,
        name: "Maxamed Cusmaan Ibraahim",
        notaryName: "Cadaalah",
        district: "MA LAHAN",
        region: "Gobolka Hiiraan-B/weyne",
        issueDate: "15 August 2021"
    },
    {
        id: 1120,
        name: "Xasan Maxamed Xalane",
        notaryName: "Buulburta",
        district: "MA LAHAN",
        region: "Gobolka Hiiraan-Buuloburde",
        issueDate: "15 August 2021"
    },
    {
        id: 1121,
        name: "Xabiib Maxamed Kulmiye",
        notaryName: "Jubba",
        district: "MA LAHAN",
        region: "Gobolka J/ Hoose-Kismaayo",
        issueDate: "15 August 2021"
    },
    {
        id: 1122,
        name: "Xasan Maxamed Nuur",
        notaryName: "Abuuraas",
        district: "MA LAHAN",
        region: "Gobolka J/ Hoose-Kismaayo",
        issueDate: "15 August 2021"
    },
    {
        id: 1123,
        name: "Saciid Cabdullaahi Cabdi",
        notaryName: "Garawe",
        district: "MA LAHAN",
        region: "Gobolka Nugaal-Garawe",
        issueDate: "15 August 2021"
    },
    {
        id: 1124,
        name: "Liibaan Cismaan Aaden Axmed",
        notaryName: "Bader",
        district: "MA LAHAN",
        region: "Gobolka Sh.Hoose-Afgooye",
        issueDate: "15 August 2021"
    },
    {
        id: 1125,
        name: "Maxamed M.Maxamuud Cumar (Madoobe)",
        notaryName: "Gacaliye",
        district: "MA LAHAN",
        region: "Gobolka Sh.Hoose-Afgooye",
        issueDate: "15 August 2021"
    },
    {
        id: 1126,
        name: "Maxamed Mukhtaar Cabdullaahi",
        notaryName: "Muqtaar",
        district: "MA LAHAN",
        region: "Gobolka Sh.Hoose-Afgooye",
        issueDate: "15 August 2021"
    },
    {
        id: 1127,
        name: "Najiib Xasan Cumar Maxamed",
        notaryName: "Dr.Rooble",
        district: "MA LAHAN",
        region: "Gobolka Sh.Hoose-Afgooye",
        issueDate: "15 August 2021"
    },
    {
        id: 1128,
        name: "Bashiir Xuseen Maxamed",
        notaryName: "Shabeele",
        district: "MA LAHAN",
        region: "Gobolka Sh.Hoose-Afgooye",
        issueDate: "15 August 2021"
    },

    { id: 1129, name: "Ismaaciil Macalin Maxamuud Cali", notaryName: "Salaama", district: "Boondheere Siinaay", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1130, name: "Zakariye Axmed Xasan", notaryName: "Rodol", district: "Boondheere Siinaay", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1131, name: "Shaafici Maxamed Axmed Cali", notaryName: "Dulqaad", district: "Dayniile Daaru-Salaam", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1132, name: "Xaliimo Axmed Faarax Kaariye", notaryName: "Taajir Mulki", district: "Dharkeynlay Dabakaye Cagaar", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1133, name: "Ibraahim Daahir Xuseen", notaryName: "Rayaan", district: "Dharkeynley Suuq liif", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1134, name: "Xaydar Cali Odowaa Cosoble", notaryName: "Odawaa", district: "Dharkeynley Ajibka Madiina", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1135, name: "Daahir Cabdi Maxamuud (Boolis)", notaryName: "Xamar", district: "Dharkeynley Gerash.M Nuur", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1136, name: "Maxamed Cumar Ibraahim", notaryName: "Rasmi Muqdsiho", district: "Dharkeynley Macmacaanka", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1137, name: "Maxamed Sh Axmed Xasan", notaryName: "Hilaal", district: "Dharkeynley Macmacaanka", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1138, name: "Xusseen Maxamed Calasow", notaryName: "Tawakal", district: "Dharkeynley Saciid Rooraaye", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1139, name: "Axmed Ciise Guutaale Aden", notaryName: "Qaran", district: "Hoden Isg. Taleex", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1140, name: "Cabdulwaaxid Maxamed Xuseen (Wakiil)", notaryName: "Cilmi", district: "Hoden Isg. Taleex", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1141, name: "Cabdiraxmaan Maxamed Xasan", notaryName: "Qaanuuni", district: "Hoden Isg. Taleex", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1142, name: "Ibraahim Maxamed Axmed", notaryName: "Garsoor", district: "Hoden Lmg.Taleex", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1143, name: "Axmed Sh Cali Axmed Buraale", notaryName: "Buraale", district: "Hoden Makka Al-Mukaramah", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1144, name: "Cabdi Axmed Cali (Geedi)", notaryName: "Geedi", district: "Hoden Mdx.C/qasim", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1145, name: "Cali Xaaji Maxamed Warsame", notaryName: "Warsame", district: "Hoden Oktober Faanoole", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1146, name: "Cabdiraxim Ibraahim Macalin", notaryName: "Sadsoor", district: "Hoden Oktober Xaawa Taako", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1147, name: "Maxamed Xuseen Rooble", notaryName: "Dr.Rooble", district: "Hoden Zoobe", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1148, name: "Guuleed Maxamud Jimcaale Cismaan", notaryName: "Biil", district: "Hoden Zoone F. KM15", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1149, name: "Ciise Cabdirahman Maxamed", notaryName: "Fiqi", district: "Hoden Zoone F. KM15", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1150, name: "Cabdikariim Xasan Nuur Maxamed", notaryName: "Aflax", district: "Howlwaaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1151, name: "Cabdiraxmaan Xasan Cumar", notaryName: "Soomaaliya", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1152, name: "Bashiir Macalim Maxamed Ibraahim", notaryName: "Afrax", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1153, name: "Cabdullaahi Cabdi Xirsi Faarax", notaryName: "Asal", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1154, name: "Cabdirisaaq Xasan Cilmi", notaryName: "Kulmiye", district: "Howlwadaag Baar Ubax", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1155, name: "Cali Yuusuf Xuseen", notaryName: "Xamar", district: "Howlwadaag Shiirkole", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1156, name: "Aadan Jimcaale Maxamed", notaryName: "Dayax", district: "Howlwadaag Jid. Sodonka Daallo", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1157, name: "Cabdi Axmed Cali Geedi", notaryName: "Ummadda", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1158, name: "Aadan Cali Cadow", notaryName: "Hiraabe", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1159, name: "Aadan Cilmi Maxamed (Macalin Aadan)", notaryName: "Hubiye", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1160, name: "Abuubakar Xuseen Maxamed", notaryName: "Dhagajuun", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1161, name: "Axmed Cabdiraxmaan Wehliye Maalin", notaryName: "Wehliye", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1162, name: "Axmed Ciise Cabdullaahi", notaryName: "Banaadir", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1163, name: "Axmed Ismaaciil Barre (Madaxey)", notaryName: "Xaqdhowr", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1164, name: "Cabdiqaadir Xasan Faarax", notaryName: "Al Cadaala", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1165, name: "Cabdiraxmaan Warsame Siyaad", notaryName: "Banaadir", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1166, name: "Cabdirisaaq Maxamed Cabdulle (Tiikey)", notaryName: "Tiikey", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1167, name: "Cabdishakuur Axmed Maxamed Maxamuud", notaryName: "Caddawe", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1168, name: "Cabdullaahi Maxamed Siyaad (Gaab)", notaryName: "Wadani", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1169, name: "Cabdulqaadir Ibraahim Cali", notaryName: "Caalami", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1170, name: "Cali Xaashi Cali Ugaas", notaryName: "Horseed", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1171, name: "Cali Xasan Faarax", notaryName: "Xakiim", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1172, name: "Cartan Cabdisalaam Calasow Dabey", notaryName: "Gardoon", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1173, name: "Cismaan Cabdulle Cabdi Cisman (Jeelle)", notaryName: "Al-Taqwa", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1174, name: "Ismaaciil Cali Axmed Mahad-Alle", notaryName: "Hubaal", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1175, name: "Ismaacil Maxamed Cabdullaahi", notaryName: "Shahaad", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1176, name: "Khalif Sh Ibraahim Dhiblaawe", notaryName: "Dhiblaawe", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1177, name: "Maxamed Sh. Axmed Khaliif", notaryName: "Khalifa", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1178, name: "Maxamed Cabdullaahi Cusmaan Yabarow", notaryName: "Ducaale", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1179, name: "Maxamed Cabdullahi Maxamed Siyaad", notaryName: "Tayo", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1180, name: "Maxamed Cabdulqaadir Sh.Xasan (Amiin)", notaryName: "Amiin", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1181, name: "Maxamed Cali Nuur (Socdaal)", notaryName: "Muqdisho", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1182, name: "Maxamed Ciise Dhowrane", notaryName: "Dhowrane", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1183, name: "Maxamed Yacquub Isaaq Aaden", notaryName: "Xamarcade", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1184, name: "Saciid Cali Cosoble", notaryName: "Muqdisho", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1185, name: "Salaad Maxamed Jaamac", notaryName: "Macruuf", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1186, name: "Yusuf Tuurxume Jimcaale", notaryName: "Tuurxume", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1187, name: "Maxamed Aaden Sheekh Nuur", notaryName: "Qooje", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1188, name: "Cabdi Cabdullaahi Abtidoon", notaryName: "Muqdisho", district: "Howlwadaaga Isg. Baar Ubax", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1189, name: "Cabdirashiid Maxamuud Axmed", notaryName: "Hilaaf", district: "Howlwadaaga Jidka Sodonka", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1190, name: "Muqtaar Macalim Cilmi Maxamed", notaryName: "Bayaan", district: "Howlwadaaga Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1191, name: "Saciid Cali Maxamuud", notaryName: "Taakulo", district: "Howlwadaag Suuq Bakaaro", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1192, name: "Xuseen Maxamuud Muuse", notaryName: "If-ka", district: "Kaaraan Boosteejada", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1193, name: "Cabdiraxman Sheekh Maxamed Xasan", notaryName: "Alxarameyn", district: "Kaaraan Ex-Hotel Laf-weyn", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1194, name: "Xasan Cusmaan Wehliye", notaryName: "Xamari", district: "Kaaraan Isg.Sanca", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1195, name: "Cabdirashid Cabdullaahi Maxamed", notaryName: "Aw-muuse", district: "Kaaraan Sanca", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1196, name: "Cabdulqaadir Cabdullaahi Maxamed", notaryName: "Alnuur", district: "Kaaraan Sanca", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1197, name: "Maxamuud Cali Cumar", notaryName: "Biyey", district: "Kaaraan Sanca", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1198, name: "Xasan Dhuxulow Xasan Raage", notaryName: "Dhuxulow", district: "Kaaraan Suuq Kaaraan", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1199, name: "Cali Xasan Cali Nuur", notaryName: "Talasan", district: "Kaaraan Wajeer", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1200, name: "Abuubakar Maxamed Suufi Maxamed", notaryName: "Bisle", district: "Kaaraan Xaliima Hiite", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1201, name: "Maxamuud Maxamed Cali Cashara", notaryName: "Cashara", district: "Kaxda Abaadir", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1202, name: "Maxamed Sh C/raxman Abuubakar", notaryName: "Badri", district: "Kaxda Abaadir Farjano", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1203, name: "Cabaas Cabdullaahi Bootaan Sahal", notaryName: "Bootaan", district: "Kaxda Gnrl.Liiqliiqato", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1204, name: "Maxamuud Aadan Xaashi Jimcaale", notaryName: "Habarwaa", district: "Kaxda Shimbiroole", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1205, name: "Xasan Aadan Ibraahim Maxamed", notaryName: "Bilaal", district: "Kaxda Shinbroole", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1206, name: "Xuseen Xasan Cabdulle Cumar", notaryName: "Salmaan", district: "Shibis", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1207, name: "Maxamed Nuur Maxamuud", notaryName: "Diiwaan", district: "Waabari Hantiwadaag", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1208, name: "Maxamed Diiriye Sabriye", notaryName: "Sabriye", district: "Waabari Hor. Hotel Mubarak", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1209, name: "Sh Axmed Cali Cismaan", notaryName: "Talawadaag", district: "Waabari Isg. Dabka", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1210, name: "Maxamed Cabdi Daahir Colaad", notaryName: "Colaad", district: "Waabari KM4", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1211, name: "Xuseen Maxamed Kadiye", notaryName: "Kadiye", district: "Waabari KM4", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1212, name: "Ismaaciil Maxamed Cumar", notaryName: "Saalixi", district: "Waabari Maaj", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1213, name: "Idris Maxamed Cusmaan", notaryName: "Waabari", district: "Waabari Makka Al-Mukarama", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1214, name: "Faadumo Cusmaan Xaaji Ismaaciil", notaryName: "Tagsan", district: "Waabari Shaqaalaha", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1215, name: "Aweys Sheekh Cali Qaasim", notaryName: "Horyaal", district: "Waabari Tree-piano", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1216, name: "Cismaan Maxamed Ismaaciil", notaryName: "Osmaan", district: "Waabari Tree-piano", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1217, name: "Aaden Cabdulqaadir Yaxye", notaryName: "Hufane", district: "Waabari Tree-piano", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1218, name: "Badrudiin Sheekh Rashiid Ibraahiim", notaryName: "Xijaaz", district: "Waabari Tree-piano", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1219, name: "Bashiir Maxamed Sheekh Maxamed", notaryName: "Karaama", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1220, name: "Cali Sheekh Cabdi", notaryName: "Ilkadahab", district: "Waabari Tree-Piano", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1221, name: "Yaasiin Cabdi Xasan", notaryName: "Rogaal", district: "Waabari Tree-piano", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1222, name: "Cabdifitaax Cumar Maxamed", notaryName: "Kaatib", district: "Waabari Xaaji Baasto", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1223, name: "Cabdulqaadir Cumar Kaatib", notaryName: "Kaatib", district: "Waabari Xaaji Baasto", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1224, name: "Cusman Cumar Kaatib", notaryName: "Tahajid", district: "Waabari Xaaji Baasto", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1225, name: "Cabdullaahi Faarax Qaarey", notaryName: "Qaarey", district: "Wadajir KM4", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1226, name: "Cumar Maxamed Faarax (Gomed)", notaryName: "Faaruuq", district: "Wadajir KM4", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1227, name: "Cabdiraxman Maxamuud Cali (Time Cade)", notaryName: "Banaadir Time Cade", district: "Wadajir KM4", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1228, name: "Yoonis Cabdiraxman Maxamud Cali", notaryName: "Banaadir Danuun", district: "Wadajir KM4", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1229, name: "Cabdiraxmaan Daahir Cabdi Booliis", notaryName: "Barako", district: "Wadajir Korontada", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1230, name: "Cabdi Aaden Macalin Cabdulle", notaryName: "Mucallim", district: "Warta-Nabada Jid. Mareexan", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1231, name: "Xuseen Aaden Xasan Yaasiin", notaryName: "Xaydar", district: "Warta-Nabada Labbo Dhagex", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1232, name: "Cabdinaasir Abuukar Xaaji Dheere", notaryName: "Dheere", district: "X/Weyne Ex-Shanema Super", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1233, name: "Abuubakar Muumin Axmed", notaryName: "Baana", district: "X/Weyne Kacaan", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1234, name: "Maxamed Maxamuud Maxamed (Dr Luu)", notaryName: "Irmaan", district: "X/Weyne Kacaan Uunlaaye", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1235, name: "Muumin Axmed Abubakar", notaryName: "Rasmi Xamar", district: "X/Weyne Kacaan Uunlaaye", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1236, name: "Cabdinaasir Sh.Cali Jimcaale", notaryName: "Kheyre", district: "X/Weyne Via Roma", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1237, name: "Cabdiqadir Sheekh Cabdiwahab Maxamed", notaryName: "Cabdiwahaab", district: "X/Weyne Via Roma", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1238, name: "Cabdulwahaab Nuur Mahdi", notaryName: "Kulan", district: "X/Weyne Via Roma", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1239, name: "Maxamed Xaaji Shiikhey Abati", notaryName: "Alfaqi", district: "X/Weyne Via Roma", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1240, name: "Yaasiin Axmed Cusmaan", notaryName: "Al-Aamin", district: "X/Weyne Via Roma", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1241, name: "Muriidi Muumin Axmed", notaryName: "Rasmi Xamar", district: "X/Weyne Kacaan Uunlaaye", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1242, name: "Cabdullaahi Xasan Wehliye", notaryName: "Qalam", district: "Yaaqshid Daaru-Salaam", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1243, name: "Maxamed Ibraahim Maxamed Cali", notaryName: "Muqdisho", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1244, name: "Xassan Sh. Maxamed Farxaan", notaryName: "Muqdisho-Studio legale", district: "Yaaqshid 4 Tarjiino", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1245, name: "Cabdifataax Axmed Cabdulle Kulan", notaryName: "Kaamil", district: "Yaaqshid Daaru-Salaam", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1246, name: "Cabdisalaan Cabdiraxmaan Caafi Cabdulle", notaryName: "Caafi", district: "Yaaqshid Daaru-Salaam", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1247, name: "Cumar Cabdi Cadaawe", notaryName: "Suldaan", district: "Yaaqshid Daaru-Salaam", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1248, name: "Feysal Maxamed Maxamuud", notaryName: "Mustaqbal", district: "Yaaqshid Daaru-Salaam", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1249, name: "Maxamed Cabdi Maxamed Xuseen", notaryName: "Gurmad", district: "Yaaqshid Daaru-Salaam", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1250, name: "Xasan Maxamed Axmed (Sunni)", notaryName: "Sunni", district: "Yaaqshid Daaru-Salaam", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1251, name: "Daahir Maxamuud Maxamed", notaryName: "Xamar", district: "Yaaqshid Ex-Control Balcad", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1252, name: "Abuubakar Yusuf Wardheere", notaryName: "Wardheere", district: "Yaaqshid Ex-Suq. Xoolaha", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1253, name: "Cismaan Cadceed Cismaan Shuuriye", notaryName: "Shuuriye", district: "Yaaqshid Ex-Suuq Xoolaha", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1254, name: "Maxamed Nuur Maxmed Cali", notaryName: "Baxnaan", district: "Yaaqshid Horseed", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1255, name: "Xasan Maxamed Cali Barrow", notaryName: "Barrow", district: "Yaaqshid Horseed", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1256, name: "Nuur Cali Culusow Geedi", notaryName: "Culusow", district: "Yaaqshid Siinaay", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1257, name: "Maxamed Cismaan Wehliye", notaryName: "Salaam Muqdisho", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1258, name: "Cabdi Cadaawe Cali", notaryName: "Ex-Banaadir", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1259, name: "Cabdi Yuusuf Xasan Maahir", notaryName: "Maahir", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1260, name: "Cabdiraxmaan Xuseen Maxamuud", notaryName: "Timo-weyne", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1261, name: "Cabdiwali Xasan Culusow Cali", notaryName: "Al-faraj", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1262, name: "Cali Macalin Xasan Maxamuud", notaryName: "Kalsan", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1263, name: "Daahir Xaaji Xasan Axmed", notaryName: "Waano", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1264, name: "Maxamed Xuseen Xasan", notaryName: "Talawadaag", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1265, name: "Maxamed Cabdullaahi Hagar Maxamuud", notaryName: "Balli", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1266, name: "Qaasim Maxamed Ibrahim Barrow", notaryName: "Qaasimmi", district: "Yaaqshid Suuq Bacaad", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1267, name: "Aweys Ibraahim Xuseen", notaryName: "Aweis", district: "Yaaqshid Towfiiq", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1268, name: "Ibrahim Xasan Sheekh Xuseen", notaryName: "Towfiiq", district: "Yaaqshid Towfiiq", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1269, name: "Muxuyadiin Xasan Maxamed", notaryName: "Azhari", district: "Yaaqshid Towfiiq", region: "Banaadir", issueDate: "30 JANUARY 2022" },
    { id: 1270, name: "Abuubakar Jeylaani Sh. Abuukar (Wakiil)", notaryName: "Al-Falax", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1271, name: "Axmed Xasan Shidane", notaryName: "Daaru Salaam", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1272, name: "Cabaas Cabdiraxmaan Maxamuud", notaryName: "Banadir Al-Cabasiyah", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1273, name: "Cabdiraxmaan Axmed Shire Guuleed", notaryName: "Dhiblaawe", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1274, name: "Cabdirisaaq Xasan Xuseen", notaryName: "Shaaciye", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1275, name: "Cabdishakuur Xasan Cilmi", notaryName: "Furqaan", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1276, name: "Cabdixakiim Cabdiqaadir Muudey", notaryName: "Zoobe", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1277, name: "Cabdullaahi Maxamed Muuse", notaryName: "Ogaal", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1278, name: "Cali Maxamuud Jimcaale", notaryName: "Cali Biil", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1279, name: "Cumar Cali Maxamuud Cawaale", notaryName: "CaliAgoon", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1280, name: "Feysal Cabdirashiid Axmed", notaryName: "Damal", district: "Ceelasha Afgooye", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1281, name: "Haashim Maxamed Yusuf (Kabaqori)", notaryName: "Kabaqori", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1282, name: "Liibaan Jimcaale Ibraahim (Islow)", notaryName: "Liibaan", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1283, name: "Maxamed Cabdi Axmed (Kalajaban)", notaryName: "Hiigsi", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1284, name: "Maxamed Cabdifataax Cismaan", notaryName: "Baydhabo", district: "Baydhabo", region: "Baay", issueDate: "30 JANUARY 2022" },
    { id: 1285, name: "Maxamed Cali Maxamuud Xeyle", notaryName: "Muutaale", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1286, name: "Maxamed M.Maxamuud Cumar (Madoobe)", notaryName: "Lafoole Gacaliye", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1287, name: "Maxamed Mukhtaar Cabdullaahi", notaryName: "Mukhtaar", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1288, name: "Maxamed Xaaji Jimcaale (Biil)", notaryName: "Dr Biil", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1289, name: "Najiib Xasan Cumar Maxamed", notaryName: "Shabeel", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1290, name: "Xasan Warsame Cali", notaryName: "Suuley", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1291, name: "Liibaan Cismaan Aaden Axmed", notaryName: "Bader", district: "Afgooye Ceelasha", region: "Sh. Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1292, name: "Maxamed Maxamuud Ismaaciil", notaryName: "Karaama", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1293, name: "Liibaan Cabdullaahi Muumin", notaryName: "Liibaan", district: "Afgooye Ceelasha", region: "Sh.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1294, name: "Maxamed Cusmaan Ibraahim", notaryName: "Caddaala", district: "Baladweyne", region: "Hiiraan", issueDate: "30 JANUARY 2022" },
    { id: 1295, name: "Aadan Ibraahim Buule", notaryName: "Koonfur Galbeed", district: "Baydhabo", region: "Baay", issueDate: "30 JANUARY 2022" },
    { id: 1296, name: "Khadiijo Axmed Muudey", notaryName: "Muudey", district: "Baydhabo", region: "Baay", issueDate: "30 JANUARY 2022" },
    { id: 1297, name: "Maxamed Cabdiraxmaan Aadan", notaryName: "Daacad", district: "Baydhabo", region: "Baay", issueDate: "30 JANUARY 2022" },
    { id: 1298, name: "Xuseen Isgoowe Xuseen (Xaqsoor)", notaryName: "Xaqsoor", district: "Baydhabo", region: "Baay", issueDate: "30 JANUARY 2022" },
    { id: 1299, name: "Xasan Maxamed Xalane", notaryName: "Buuloburta", district: "Buuloburta", region: "Hiiraan", issueDate: "30 JANUARY 2022" },
    { id: 1300, name: "Cabdigargaar Axmed Xaashi", notaryName: "Gargaar", district: "Cabudwaaq", region: "Galgaduud", issueDate: "30 JANUARY 2022" },
    { id: 1301, name: "Cabdinaasir Maxamed Xasan", notaryName: "Al-hudaa", district: "Cabudwaaq", region: "Galgaduud", issueDate: "30 JANUARY 2022" },
    { id: 1302, name: "Xasan Cabdi Tahliil", notaryName: "Kaah", district: "Cabudwaaq", region: "Galgaduud", issueDate: "30 JANUARY 2022" },
    { id: 1303, name: "Daahir Xasan Faarax", notaryName: "Januune", district: "Cabudwaaq", region: "Galgaduud", issueDate: "30 JANUARY 2022" },
    { id: 1304, name: "Bashiir Xuseen Maxamed", notaryName: "Hanaano", district: "Dhuusamareeb", region: "Galgaduud", issueDate: "30 JANUARY 2022" },
    { id: 1305, name: "Cabdullaahi Cali Maxamed", notaryName: "Towfiiq", district: "Gaalgacyo", region: "Mudug Glg", issueDate: "30 JANUARY 2022" },
    { id: 1306, name: "Yuusuf Cabdisalaam Warsame", notaryName: "Geeska Afrika", district: "Gaalgacyo", region: "Mudug Pld", issueDate: "30 JANUARY 2022" },
    { id: 1307, name: "Saciid Cabdullaahi Cabdi", notaryName: "Garawe", district: "Garawe", region: "Nugaal", issueDate: "30 JANUARY 2022" },
    { id: 1308, name: "Xabiib Maxamed Kulmiye", notaryName: "Jubba", district: "Kismaayo", region: "Jub.Hoose", issueDate: "30 JANUARY 2022" },
    { id: 1309, name: "Xasan Maxamed Nuur", notaryName: "Abuuraas", district: "Kismaayo", region: "Jub.Hoose", issueDate: "30 JANUARY 2022" },
    {
        id: 1310,
        name: "Cabdikariim Xasan Nuur Maxamed",
        notaryName: "Aflax",
        district: "Dayniile Aargadda Raadayrka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1311,
        name: "Bashiir Macalim Maxamed Ibraahim",
        notaryName: "Afrax",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1312,
        name: "Cabdiqaadir Xasan Faarax",
        notaryName: "Al Cadaala",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1313,
        name: "Yaasiin Axmed Cusmaan",
        notaryName: "Al-Aamin",
        district: "Xamarweyne Via Roma",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1314,
        name: "Bashiir Siyaad Maxamed",
        notaryName: "Albashiir",
        district: "Xamaweyne Via Rooma",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1315,
        name: "Maxamed Xaaji Shiikhey Abati",
        notaryName: "Alfaqi",
        district: "Xamarweyne Via Roma",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1316,
        name: "Cabdiwali Xasan Culusow Cali",
        notaryName: "Al-faraj",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1317,
        name: "Maxamed Axmed Nuur",
        notaryName: "Alkowthar",
        district: "Warta-Nabadda",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1318,
        name: "Cabdulqaadir Cabdullaahi Maxamed",
        notaryName: "Alnuur",
        district: "Kaaraan Sanca",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1319,
        name: "Cismaan Cabdulle Cabdi Cisman (Jeelle)",
        notaryName: "Al-Taqwa",
        district: "Dayniile Daaru-Salaam",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1320,
        name: "Cabdiraxman Sh Maxamed Xasan",
        notaryName: "Alxarameyn",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1321,
        name: "Maxamed Cabdulqaadir Sh. Xasan (Amiin)",
        notaryName: "Amiin",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1322,
        name: "Cabdullaahi Cabdi Xirsi Faarax",
        notaryName: "Asal",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1323,
        name: "Maxamed Salaad Xasan",
        notaryName: "Asiib",
        district: "Howlwadaag Sayidka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1324,
        name: "Aweys Ibraahim Xuseen",
        notaryName: "Aweis",
        district: "Yaaqshid Towfiiq",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1325,
        name: "Cabdirashid Cabdullaahi Maxamed",
        notaryName: "Aw-Muuse",
        district: "Kaaraan Sanca",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1326,
        name: "Muxuyadiin Xasan Maxamed",
        notaryName: "Azhari",
        district: "Yaaqshid Towfiiq",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1327,
        name: "Abuubakar Muumin Axmed",
        notaryName: "Baana",
        district: "Waabari Shaq. Makka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1328,
        name: "Cusmaan Xasan Cusmaan",
        notaryName: "Baari",
        district: "Yaaqshid Ex Suuqa Xoolaha",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1329,
        name: "Cabdiqaadir Cabdi Axmed",
        notaryName: "Bakaal",
        district: "Xamarwaeyne Via Rooma.",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1330,
        name: "Maxamed Cabdullaahi Hagar Maxamuud",
        notaryName: "Balli",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1331,
        name: "Axmed Ciise Cabdullaahi",
        notaryName: "Banaadir",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1332,
        name: "Cabdiraxmaan Warsame Siyaad",
        notaryName: "Banaadir",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1333,
        name: "Cabdiraxman Maxamuud Cali (Time Cade)",
        notaryName: "Banaadir",
        district: "Wadajir KM4",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1334,
        name: "Yoonis Cabdiraxman Maxamud Cali",
        notaryName: "Banaadir Danuun",
        district: "Wadajir KM4",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1335,
        name: "Cumar Faarax Axmed",
        notaryName: "Baraawe",
        district: "Cabdulcasiis Marinaaya",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1336,
        name: "Cabdiraxmaan Daahir Cabdi Booliis",
        notaryName: "Barako",
        district: "Wadajir Korontada",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1337,
        name: "Xasan Maxamed Cali Barrow",
        notaryName: "Barrow",
        district: "Yaaqshid Ex Suuqa Xoolaha",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1338,
        name: "Xasan Maxamed Sh. Maxamed",
        notaryName: "Baryare",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1339,
        name: "Maxamed Nuur Maxmed Cali",
        notaryName: "Baxnaan",
        district: "Yaaqshid Horseed",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1340,
        name: "Muqtaar Macalim Cilmi Maxamed",
        notaryName: "Bayaan",
        district: "Howlwadaaga Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1341,
        name: "Xasan Aadan Ibraahim Maxamed",
        notaryName: "Bilaal",
        district: "Kaxda Shinbroole",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1342,
        name: "Abuubakar Maxamed Suufi Maxamed",
        notaryName: "Bisle",
        district: "Kaaraan Xaliima Hiite",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1343,
        name: "Maxamuud Cali Cumar",
        notaryName: "Biyey",
        district: "Kaaraan Sanca",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1344,
        name: "Cabdikariim Maxamed Biyow",
        notaryName: "Biyow",
        district: "Kaaraan Suuqa Dahabka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1345,
        name: "Cabaas Cabdullaahi Bootaan Sahal",
        notaryName: "Bootaan",
        district: "Kaxda Gnrl.Liiqliiqato",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1346,
        name: "Maxamed Cabdiraxmaan Sh. Maxamed",
        notaryName: "Boqole",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1347,
        name: "Cabdisalaan Cabdiraxmaan Caafi Cabdulle",
        notaryName: "Caafi",
        district: "Yaaqshid Daaru-Salaam",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1348,
        name: "Cabdulqaadir Ibraahim Cali",
        notaryName: "Caalami",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1349,
        name: "Cabdiqadir Sheekh Cabdiwahab Maxamed",
        notaryName: "Cabdiwahaab",
        district: "Xamarweyne Via Roma",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1350,
        name: "Cabdishakuur Axmed Maxamed Maxamuud",
        notaryName: "Caddawe",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1351,
        name: "Cabdiraxmaan Cali Maxamed Hiraabe",
        notaryName: "Cali Hiraabe",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1352,
        name: "Cali Abuukar Xaayow",
        notaryName: "Cali Marduuf",
        district: "Cabdulcasiis",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1353,
        name: "Cumar Cali Maxamuud Cawaale",
        notaryName: "Cali-Agoon",
        district: "Yaaqshid Daru-Salaam",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1354,
        name: "Aweys Yuusuf Caraale",
        notaryName: "Caraale",
        district: "Xamrweyne Via Rooma",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1355,
        name: "Maxamuud Maxamed Cali Cashara",
        notaryName: "Cashara",
        district: "Dharkeyley AJabka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1356,
        name: "Xuseen Cali Maxamuud",
        notaryName: "Cawaale",
        district: "Yaaqshid Daaru-Salaam",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1357,
        name: "Xuseen Cabdi Cilmi",
        notaryName: "Cilmi",
        district: "Waabari Jidka 21 October",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1358,
        name: "Maxamed Cabdi Daahir Colaad",
        notaryName: "Colaad",
        district: "Waabari KM4",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1359,
        name: "Nuur Cali Culusow Geedi",
        notaryName: "Culusow",
        district: "Yaaqshid Siinaay",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1360,
        name: "Maxamed Cabdiraxmaan Aadan",
        notaryName: "Daacad",
        district: "Waabari Isg. Dabka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1361,
        name: "Maxamed Dalmar Axmed",
        notaryName: "Dalmar",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1362,
        name: "Naciima Cali Barre",
        notaryName: "Dalsan",
        district: "Xamrweyne Via Rooma",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1363,
        name: "Nuux Cabdullahi Cusmaan",
        notaryName: "Daryeel",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1364,
        name: "Aadan Jimcaale Maxamed",
        notaryName: "Dayax",
        district: "Howlwadaag Jid.Sod. Dallo",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1365,
        name: "Abuubakar Xuseen Maxamed",
        notaryName: "Dhagajuun",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1366,
        name: "Dhaqane Isxaaq Cabdi",
        notaryName: "Dhaqane",
        district: "Waabari Tree-Piano",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1367,
        name: "Cabdinaasir Abuukar Xaaji Dheere",
        notaryName: "Dheere",
        district: "X/Weyne Ex-Shanem Super",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1368,
        name: "Nuur Maxamed Maxamuud",
        notaryName: "Dhooley",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1369,
        name: "Maxamed Ciise Dhowrane",
        notaryName: "Dhowrane",
        district: "Waabari Tree-Piano",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1370,
        name: "Xasan Dhuxulow Xasan Raage",
        notaryName: "Dhuxulow",
        district: "Kaaraan Suuq Kaaraan",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1371,
        name: "Maxamed Nuur Maxamuud",
        notaryName: "Diiwaan",
        district: "Waabari Hantiwadaag",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1372,
        name: "Shaafici Maxamed Axmed Cali",
        notaryName: "Dulqaad",
        district: "Dayniile Daaru-Salaam",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1373,
        name: "Daahir Maxamuud Maxamed",
        notaryName: "ENP Xamar",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1374,
        name: "Cabdi Cadaawe Cali",
        notaryName: "Ex-Banaadir",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1375,
        name: "Cumar Maxamed Faarax (Gomed)",
        notaryName: "Faaruuq",
        district: "Wadajir KM4",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1376,
        name: "Maxamuud Cabdi Macalin Abuukar",
        notaryName: "Fanax",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1377,
        name: "Maxamuud Maxamed Cabdi",
        notaryName: "Findhig",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1378,
        name: "Ciise Cabdirahman Maxamed",
        notaryName: "Fiqi",
        district: "Hoden Zoone F. KM15",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1379,
        name: "Cartan Cabdisalaam Calasow Dabey",
        notaryName: "Gardoon",
        district: "Hoden Tarabuunka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1380,
        name: "Ibraahim Maxamed Axmed",
        notaryName: "Garsoor",
        district: "Hoden Lmg. Taleex",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1381,
        name: "Cabdi Axmed Cali (Geedi)",
        notaryName: "Geedi",
        district: "Hoden Madaxt.C/qasim",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1382,
        name: "Xalwo Maxamed Axmed",
        notaryName: "Gorgor",
        district: "Hoden Tarabuunka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1383,
        name: "Maxamed Cabdi Maxamed Xuseen",
        notaryName: "Gurmad",
        district: "Yaaqshid Daaru-Salaam",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1384,
        name: "Xamza Maxamed Cabdullaahi",
        notaryName: "Guudle",
        district: "Xamarweyne Via Rooma",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1385,
        name: "Maxamuud Aadan Xaashi Jimcaale",
        notaryName: "Habarwaa",
        district: "Kaxda Shimbiroole",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1386,
        name: "Cabdiqaadir Salaad Maxamed",
        notaryName: "Haleel",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1387,
        name: "Cali Maxamed Cilmi",
        notaryName: "Harsan",
        district: "Yaaqishid Isg. Baar Ayaan",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1388,
        name: "Cabdirashiid Maxamuud Axmed",
        notaryName: "Hilaaf",
        district: "Howlwadaaga Jidka Sodnka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1389,
        name: "Maxamed Sh Axmed Xasan",
        notaryName: "Hilaal",
        district: "Dharkeynley Macmacaanka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1390,
        name: "Ciise Maxamed Yuusuf",
        notaryName: "Himilo",
        district: "Xamarweyne Via Rooma",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1391,
        name: "Aadan Cali Cadow",
        notaryName: "Hiraabe",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1392,
        name: "Cali Xaashi Cali Ugaas",
        notaryName: "Horseed",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1393,
        name: "Aweys Sheekh Cali Qaasim",
        notaryName: "Horyaal",
        district: "Waabari Tree-Piano",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1394,
        name: "Ismaaciil Cali Axmed Mahad-Alle",
        notaryName: "Hubaal",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1395,
        name: "Aadan Cilmi Maxamed (Macalin Aadan)",
        notaryName: "Hubiye",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1396,
        name: "Aaden Cabdulqaadir Yaxye",
        notaryName: "Hufane",
        district: "Waabari Tree-Piano",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1397,
        name: "Xuseen Maxamuud Muuse",
        notaryName: "If-ka",
        district: "Kaaraan Boosteejada",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1398,
        name: "Maxamed Xirsi Sheekhdoon",
        notaryName: "Ileys",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1399,
        name: "Cali Sheekh Cabdi",
        notaryName: "Ilkadahab",
        district: "Waabari Tree-Piano",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1400,
        name: "Maxamed Maxamuud Maxamed (Dr Luu)",
        notaryName: "Irmaan",
        district: "X/Weyne Kacaan Uunlaaye",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1401,
        name: "Xasan Axmed Cabdulle",
        notaryName: "Irshaad",
        district: "Hoden Zoobe KM5",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1402,
        name: "Abuukar Cabdulle Maxamed",
        notaryName: "Jaran",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1403,
        name: "Cabdullaahi Aadan Maxamuud",
        notaryName: "Kaafiye",
        district: "Dayniile SiisiiMasjid Muumino",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1404,
        name: "Maxamed Cabdullaahi Xuseen",
        notaryName: "Kaahiye",
        district: "Xamarweyne Via Rooma",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1405,
        name: "Cabdifataax Axmed Cabdulle Kulan",
        notaryName: "Kaamil",
        district: "Yaaqshid Daaru-Salaam",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1406,
        name: "Cabdifitaax Cumar Maxamed",
        notaryName: "Kaatib",
        district: "Waabari Xaaji Baasto",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1407,
        name: "Cabdulqaadir Cumar Kaatib",
        notaryName: "Kaatib",
        district: "Waabari Xaaji Baasto",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1408,
        name: "Yaxya Maxamuud Maxamed",
        notaryName: "Kaay-kaay",
        district: "Dayniile Aargadda Halgan",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1409,
        name: "Xuseen Maxamed Kadiye",
        notaryName: "Kadiye",
        district: "Waabari KM4",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1410,
        name: "Cali Macalin Xasan Maxamuud",
        notaryName: "Kalsan",
        district: "Waabari Maajo Shaqaalaha",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1411,
        name: "Bashiir Maxamed Sheekh Maxamed",
        notaryName: "Karaama",
        district: "Waabari Tree-Piano",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1412,
        name: "Maxamed Sh. Axmed Khaliif",
        notaryName: "Khalifa",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1413,
        name: "Cabdinaasir Sh. Cali Jimcaale",
        notaryName: "Kheyre",
        district: "X/Weyne Via Roma",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1414,
        name: "Cabdulwahaab Nuur Mahdi",
        notaryName: "Kulan",
        district: "Xamarweyne Via Roma",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1415,
        name: "Cabdirisaaq Xasan Cilmi",
        notaryName: "Kulmiye",
        district: "Howlwadaag Baar Ubax",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1416,
        name: "Liibaan Cusmaan Aadan",
        notaryName: "Liban",
        district: "Hoden Zoobe KM5",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1417,
        name: "Salaad Maxamed Jaamac",
        notaryName: "Macruuf",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1418,
        name: "Cabdullaahi Axmed Xirsi",
        notaryName: "Mahadale",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1419,
        name: "Muniira Cabdiqaadir Khadar",
        notaryName: "Miftaax",
        district: "Xamarweyne Via Roma",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1420,
        name: "Cumar Sh Axmed Ciise",
        notaryName: "Mubaarak",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1421,
        name: "Cabdi Aaden Macalin Cabdulle",
        notaryName: "Mucallim",
        district: "Warta-Nabada Jid. Mareexaan",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1422,
        name: "Cabdi Cabdullaahi Abtidoon",
        notaryName: "Muqdisho",
        district: "Howlwadaaga Isg.Baar Ubax",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1423,
        name: "Cabdullaahi Sh Daahir Xasan",
        notaryName: "Muqdisho",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1424,
        name: "Daahir Xaaji Xasan Axmed",
        notaryName: "Muqdisho",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1425,
        name: "Maxamed Cali Nuur (Socdaal)",
        notaryName: "Muqdisho",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1426,
        name: "Maxamed Ibraahim Maxamed Cali",
        notaryName: "Muqdisho",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1427,
        name: "Saciid Cali Cosoble",
        notaryName: "Muqdisho",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1428,
        name: "Xassan Sh. Maxamed Farxaan",
        notaryName: "Muqdisho-Studio legale",
        district: "Yaaqshid 4ta Jerdiino",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1429,
        name: "Feysal Maxamed Maxamuud",
        notaryName: "Mustaqbal",
        district: "Yaaqshid Daaru-Salaam",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1430,
        name: "Maxamed Muxuyadiin Caraale",
        notaryName: "Naafic",
        district: "Waabari Makka Almukarama",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1431,
        name: "Cabdifitaax Faarax Naaleeye",
        notaryName: "Naaleeye",
        district: "Waabari Jidka Liberia",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1432,
        name: "Xaydar Cali Odowaa Cosoble",
        notaryName: "Odawaa",
        district: "Dharkeynley AJabka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1433,
        name: "Cismaan Maxamed Ismaaciil",
        notaryName: "Osmaan",
        district: "Waabari Tree-Piano",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1434,
        name: "Kayse Saciid Cartan",
        notaryName: "Qaaddi",
        district: "Boondheere Wadada Jubba",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1435,
        name: "Cabdiraxmaan Maxamed Xasan",
        notaryName: "Qaanuuni",
        district: "Hoden Isgoyska. Taleex",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1436,
        name: "Cabdullaahi Faarax Qaarey",
        notaryName: "Qaarey",
        district: "Wadajir KM4",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1437,
        name: "Qaasim Maxamed Ibrahim Barrow",
        notaryName: "Qaasimmi",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1438,
        name: "Cabdullaahi Xasan Wehliye",
        notaryName: "Qalam",
        district: "Yaaqshid Daaru-Salaam",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1439,
        name: "Maxamed Cabdi Axmed",
        notaryName: "Qaran",
        district: "Hoden Isgoyska Taleex",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1440,
        name: "Maxamuud Nuur Maxamed",
        notaryName: "Qoobeey",
        district: "Waabari Maajo Makka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1441,
        name: "Maxamed Aaden Sheekh Nuur",
        notaryName: "Qooje",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1442,
        name: "AxmedNuur Cabdi Warsame",
        notaryName: "Qoole",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1443,
        name: "Maxamed Cumar Ibraahim",
        notaryName: "Rasmi Muqdsiho",
        district: "Dharkeynley Macmacaanka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1444,
        name: "Muriidi Muumin Axmed",
        notaryName: "Rasmi Xamar",
        district: "X/Weyne Kacaan Uunlaaye",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1445,
        name: "Muumin Axmed Abubakar",
        notaryName: "Rasmi Xamar",
        district: "X/Weyne Kacaan Uunlaaye",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1446,
        name: "Ibraahim Daahir Xuseen",
        notaryName: "Rayaan",
        district: "Dharkeynley Macmacaanka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1447,
        name: "Yaasiin Cabdi Xasan",
        notaryName: "Rogaal",
        district: "Waabari Tree-Piano",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1448,
        name: "Maxamed Diiriye Sabriye",
        notaryName: "Sabriye",
        district: "Waabari Maajo Makka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1449,
        name: "Cabdiraxim Ibraahim Macalin",
        notaryName: "Sadsoor",
        district: "Xamarweyne Ceelgaabta",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1450,
        name: "Maxamed Cismaan Wehliye",
        notaryName: "Salaam",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1451,
        name: "Ismaaciil Macalin Maxamuud Cali",
        notaryName: "Salaama",
        district: "Kaaraan Gubadley",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1452,
        name: "Cabdifataax Cabdisamad Cabdiraxmaan",
        notaryName: "Shaahid",
        district: "Xamarweyne Muqdisho Mall",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1453,
        name: "Ismaacil Maxamed Cabdullaahi",
        notaryName: "Shahaad",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1454,
        name: "Cismaan Cadceed Cismaan Shuuriye",
        notaryName: "Shuuriye",
        district: "Yaaqshid Daaru-Salaam",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1455,
        name: "Cabdiqaadir Cali Siyaad",
        notaryName: "Siyaad",
        district: "Hoden Jidka Tarbuunka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1456,
        name: "Cumar Cabdi Cadaawe",
        notaryName: "Suldaan",
        district: "Yaaqshid Daaru-Salaam",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1457,
        name: "Xasan Maxamed Axmed (Sunni)",
        notaryName: "Sunni",
        district: "Yaaqshid Daaru-Salaam",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1458,
        name: "Saciid Cali Maxamuud",
        notaryName: "Taakulo",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1459,
        name: "Faadumo Cusmaan Xaaji Ismaaciil",
        notaryName: "Tagsan",
        district: "Hoden Isgoyska Taleex",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1460,
        name: "Cusman Cumar Kaatib",
        notaryName: "Tahajid",
        district: "Waabari Xaaji Baasto",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1461,
        name: "Cali Xasan Cali Nuur",
        notaryName: "Talasan",
        district: "Cabdicasiis Waxda Lowyacade",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1462,
        name: "Maxamed Xuseen Xasan",
        notaryName: "Talawadaag",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1463,
        name: "Sh Axmed Cali Cismaan",
        notaryName: "Talawadaag",
        district: "Waabari Isgoyska Dabka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1464,
        name: "Xusseen Maxamed Calasow",
        notaryName: "Tawakal",
        district: "Dharkeynley SuuqLiif",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1465,
        name: "Maxamed Cabdullahi Maxamed Siyaad",
        notaryName: "Tayo",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1466,
        name: "Cabdirisaaq Maxamed Cabdulle (Tiikey)",
        notaryName: "Tiikey",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1467,
        name: "Cabdiraxmaan Xuseen Maxamuud",
        notaryName: "Timo-weyne",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1468,
        name: "Ibrahim Xasan Sheekh Xuseen",
        notaryName: "Towfiiq",
        district: "Yaaqshid Towfiiq",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1469,
        name: "Yusuf Tuurxume Jimcaale",
        notaryName: "Tuurxume",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1470,
        name: "Cabdiraxmaan Nuur Tuuryare",
        notaryName: "Tuuryare",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1471,
        name: "Idris Maxamed Cusmaan",
        notaryName: "Waabari",
        district: "Waabari Shaq. Makka",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1472,
        name: "C\\qaadir Maxamed Cosoble",
        notaryName: "Waasuge",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1473,
        name: "Idriis Cabdiraxmaan Maxamuud",
        notaryName: "Wadan",
        district: "Kaaraan Sanca",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1474,
        name: "Cabdullaahi Maxamed Siyaad (Gaab)",
        notaryName: "Wadani",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1475,
        name: "Abuubakar Yusuf Wardheere",
        notaryName: "Wardheere",
        district: "Yaaqshid Ex-Suuq Xoolaha",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1476,
        name: "Cali Xaaji Maxamed Warsame",
        notaryName: "Warsame",
        district: "Hoden Oktober Faanoole",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1477,
        name: "Axmed Cabdiraxmaan Wehliye Maalin",
        notaryName: "Wehliye",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1478,
        name: "Safiyo Yuusuf Tuurxume",
        notaryName: "Xaaji Tuurxume",
        district: "Yaaqshid Suuq Bacaad",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1479,
        name: "Cali Xasan Faarax",
        notaryName: "Xakiim",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1480,
        name: "Cabdirisaaq Mire Maxamed",
        notaryName: "Xalane",
        district: "Warta-Nabada labbo Dhagax",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1481,
        name: "Cali Yuusuf Xuseen",
        notaryName: "Xamar",
        district: "Howlwadaag Shiirkole",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1482,
        name: "Maxamed Yacquub Isaaq Aaden",
        notaryName: "Xamarcade",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1483,
        name: "Xasan Cusmaan Wehliye",
        notaryName: "Xamari",
        district: "Kaaraan Isgoyska Sanca",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1484,
        name: "Axmed Ismaaciil Barre (Madaxey)",
        notaryName: "Xaqdhowr",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1485,
        name: "Xuseen Aaden Xasan Yaasiin",
        notaryName: "Xaydar",
        district: "Warta-Nabada Labbo Dhagex",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1486,
        name: "Badrudiin Sheekh Rashiid Ibraahiim",
        notaryName: "Xijaaz",
        district: "Waabari Tree-Piano",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1487,
        name: "Maxamed Mucallin Cusmaan",
        notaryName: "Xuubey",
        district: "Howlwadaag Suuq Bakaaro",
        region: "Banaadir",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1488,
        name: "Xasan Maxamed Nuur",
        notaryName: "Abuuraas",
        district: "Kismaayo",
        region: "Jub.Hose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1489,
        name: "Abuubakar Jeylaani Sh Abuukar",
        notaryName: "Al-Falaax",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1490,
        name: "Cabdinaasir Maxamed Xasan",
        notaryName: "Al-hudaa",
        district: "Cabudwaaq",
        region: "Galgadud",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1491,
        name: "Cabdiraxmaan Muuse Axmed",
        notaryName: "Amaana",
        district: "Afgooye Ceelasha",
        region: "Sh Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1492,
        name: "Cabdullaahi Sh Ibraahim Aadan (Xaydar)",
        notaryName: "Arlaadi",
        district: "Baydhabo",
        region: "Baay",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1493,
        name: "Cabdishakuur Cumar Cali",
        notaryName: "Baalbaal",
        district: "Balcad",
        region: "Sh Dhexe",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1494,
        name: "Axmed Yaxye Maxamed",
        notaryName: "Bakooraan",
        district: "Afgooye Ceelasha",
        region: "Sh Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1495,
        name: "Cabdullaahi Muxudiin Xasan",
        notaryName: "Barkulan",
        district: "Balcad",
        region: "Sh Dhexe",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1496,
        name: "Maxamed Cali Nuur",
        notaryName: "Barqadle",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1497,
        name: "Aadan Maxamed Axmed (Afgooye)",
        notaryName: "Bile",
        district: "Baladxaawo",
        region: "Gedo",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1498,
        name: "Maxamed Cilmi Maxamed",
        notaryName: "Bulsho",
        district: "Balcad",
        region: "Sh Dhexe",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1499,
        name: "Maxamed Cusmaan Ibraahim",
        notaryName: "Caddaala",
        district: "Baladweyne",
        region: "Hiiraan",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1500,
        name: "Cali Maxamuud Jimcaale",
        notaryName: "Cali Biil",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1501,
        name: "Aadam Maxamed Carmo",
        notaryName: "Carmoole",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1502,
        name: "Maxamed Yuusuf Ibraahim",
        notaryName: "Cirro",
        district: "Balcad",
        region: "Sh Dhexe",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1503,
        name: "Cismaan Xasan Cabdi",
        notaryName: "CismaanDheere",
        district: "Afgooye Ceelasha",
        region: "Sh Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1504,
        name: "Axmed Xasan Shidane",
        notaryName: "Daaru Salaam",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1505,
        name: "Feysal Cabdirashiid Axmed",
        notaryName: "Damal",
        district: "Afgooye Ceelasha",
        region: "Sh. Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1506,
        name: "Maxamed Tahliil Xaashi",
        notaryName: "Deegaan",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1507,
        name: "Cabdiraxmaan Axmed Shire Guuleed",
        notaryName: "Dhiblaawe",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1508,
        name: "Maxamuud Xaaji Jimcaale (Biil)",
        notaryName: "Dr.Biil",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1509,
        name: "Cabdiraxiim Maxamuud Maxamed",
        notaryName: "Durdur",
        district: "Buuhoodle",
        region: "Togdheer",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1510,
        name: "Cabdishakuur Xasan Cilmi",
        notaryName: "Furqaan",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1511,
        name: "Muhayadiin Cabdikariin Maxamed",
        notaryName: "Gaalkacyo",
        district: "Gaalkacyo",
        region: "Mudug G",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1512,
        name: "Maxamed M.Maxamuud Cumar (Madoobe)",
        notaryName: "Gacaliye",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1513,
        name: "Cabdigargaar Axmed Xaashi",
        notaryName: "Gargaar",
        district: "Cabudwaaq",
        region: "Galgadud",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1514,
        name: "Cabdiqaadir Faarax Nuur",
        notaryName: "Garyaqaan",
        district: "Garoowe",
        region: "Nugaal",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1515,
        name: "Yuusuf Cabdisalaam Warsame",
        notaryName: "Geeska Afrika",
        district: "Gaalgacyo",
        region: "Mudug Pl",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1516,
        name: "Bashiir Xuseen Maxamed",
        notaryName: "Hanaano",
        district: "Dhuusamareeb",
        region: "Galgadud",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1517,
        name: "Maxamed Cali Ibraahim",
        notaryName: "Hareeri",
        district: "Afgooye Ceelasha",
        region: "Sh Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1518,
        name: "Maxamuud Xuseen Maxamed",
        notaryName: "Horyaal",
        district: "Balcad",
        region: "Sh Dhexe",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1519,
        name: "Bilaal Xamsa Maxamed",
        notaryName: "Jamhuuriya",
        district: "Balcad",
        region: "Sh Dhexe",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1520,
        name: "Daahir Xasan Faarax",
        notaryName: "Januune",
        district: "Dhuusamareeb",
        region: "Galgadud",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1521,
        name: "Xabiib Maxamed Kulmiye",
        notaryName: "Jubba",
        district: "Kismaayo",
        region: "Jub.Hose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1522,
        name: "Xasan Ibraahim Sh Cusmaan",
        notaryName: "Kaariko",
        district: "Wanlawayne",
        region: "Sh Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1523,
        name: "Haashim Maxamed Yusuf (Kabaqori)",
        notaryName: "Kabaqori",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1524,
        name: "Maxamed Maxamuud Ismaaciil",
        notaryName: "Karaama",
        district: "Afgooye Ceelasha",
        region: "Sh. Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1525,
        name: "Xasan Muuse Nuux",
        notaryName: "Karkaar",
        district: "Qardho",
        region: "Barri",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1526,
        name: "Sh.Maxamuud Yuusuf Maxamuud",
        notaryName: "Kulmiye",
        district: "Garoowe",
        region: "Nugaal",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1527,
        name: "Maxamed Cali Maxamuud Xeyle",
        notaryName: "Lafoole",
        district: "Afgooye Ceelasha",
        region: "Sh. Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1528,
        name: "Liibaan Cabdullaahi Muumin",
        notaryName: "Liibaan",
        district: "Baladweyne",
        region: "Hiiraan",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1529,
        name: "Liibaan Jimcaale Ibraahim (Islow)",
        notaryName: "Liibaan",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1530,
        name: "Cabdixafiid Maxamed M Maxamuud",
        notaryName: "Madoobe",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1531,
        name: "Ibraahim Maxamed Cali",
        notaryName: "Manhal",
        district: "Baydhabo",
        region: "Baay",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1532,
        name: "Mahad Xuseen Cali",
        notaryName: "Maqdas",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1533,
        name: "Cabdirisaaq Yacquub Xasan",
        notaryName: "Marwaaz",
        district: "Baydhabo",
        region: "Baay",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1534,
        name: "Maxamed Mukhtaar Cabdullaahi",
        notaryName: "Mukhtaar",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1535,
        name: "Khadiijo Axmed Muudey",
        notaryName: "Muudey",
        district: "Baydhabo",
        region: "Baay",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1536,
        name: "Maxamed Cabdifataax Cismaan",
        notaryName: "Muutaale",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1537,
        name: "Najiib Cabdi Cali",
        notaryName: "Najiib",
        district: "Afgooye Ceelasha",
        region: "Sh. Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1538,
        name: "Cabdullaahi Maxamed Muuse",
        notaryName: "Ogaal",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1539,
        name: "Saciid Cabdullaahi Cabdi",
        notaryName: "Puntland",
        district: "Garoowe",
        region: "Nugaal",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1540,
        name: "Cabdullaahi Saciid Cismaan",
        notaryName: "Saadaal",
        district: "Boosaaso",
        region: "Barri",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1541,
        name: "Caamir Cali Maxamuud",
        notaryName: "Sahan",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1542,
        name: "Cali Xaaji Maxamed Xasan",
        notaryName: "Sh Cali Xaaji",
        district: "Balcad",
        region: "Sh Dhexe",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1543,
        name: "Cabdirisaaq Xasan Xuseen",
        notaryName: "Shaaciye",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1544,
        name: "Cabdulxakiim Shaafi Yuusuf",
        notaryName: "Shaafi",
        district: "Kismaayo",
        region: "Jub.Hose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1545,
        name: "Mahad Maxamed Cabdi",
        notaryName: "Shaahid",
        district: "Cabudwaaq",
        region: "Galgadud",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1546,
        name: "Najiib Xasan Cumar Maxamed",
        notaryName: "Shabeel",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1547,
        name: "Iqra Yuusuf Ibraahim",
        notaryName: "Sooyaal",
        district: "Afgooye Ceelasha",
        region: "Sh Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1548,
        name: "Cabdulaahi Daahir Cabdi",
        notaryName: "Sumcad",
        district: "Guriceel",
        region: "Galgaduud",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1549,
        name: "Xasan Warsame Cali",
        notaryName: "Suuley",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1550,
        name: "Cabdullaahi Cali Maxamed",
        notaryName: "Towfiiq",
        district: "Gaalgacyo",
        region: "Mudug G",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1551,
        name: "Daahir Cilmi Cali (Mucallim. Daahir)",
        notaryName: "Waayeel",
        district: "Balcad",
        region: "Sh Dhexe",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1552,
        name: "Ismaaciil Xasan Wehliye",
        notaryName: "Wehliye",
        district: "Kismaayo",
        region: "Jub. Hose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1553,
        name: "Xasan Maxamed Xalane",
        notaryName: "Xalane",
        district: "Buuloburta",
        region: "Hiiraan",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1554,
        name: "Xuseen Isgoowe Xuseen (Xaqsoor)",
        notaryName: "Xaqsoor",
        district: "Baydhabo",
        region: "Baay",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1555,
        name: "Xasan Maxamed Cusmaan Cumar",
        notaryName: "XasanBile",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1556,
        name: "Zakariye Mahad Diiriye",
        notaryName: "Xog-Ogaal",
        district: "Afgooye Ceelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1557,
        name: "Cabdiraxmaan Axmed Cali",
        notaryName: "Zaahir",
        district: "Balcad",
        region: "Sh Dhexe",
        issueDate: "24 JANUARY 2024"
    },
    {
        id: 1558,
        name: "Cabdixakiim Cabdiqaadir Muudey",
        notaryName: "Zoobe",
        district: "Steelasha",
        region: "Sh.Hoose",
        issueDate: "24 JANUARY 2024"
    }

];


const selectClass =
    "w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10";
const inputClass =
    "w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10";

const StatCard = ({ value, label }) => (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
        <div className="text-2xl font-extrabold text-black">{value}</div>
        <div className="mt-1 text-sm font-semibold text-black/70">{label}</div>
    </div>
);

export default function NotoryList() {
    const [search, setSearch] = useState("");
    const [region, setRegion] = useState("");
    const [district, setDistrict] = useState("");
    const [issueDate, setIssueDate] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [sortColumn, setSortColumn] = useState("id");
    const [sortDirection, setSortDirection] = useState("asc");

    const [hasSearched, setHasSearched] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    // Filters options
    const regions = useMemo(
        () => Array.from(new Set(NOTARIES.map((n) => n.region))).sort(),
        []
    );
    const districts = useMemo(
        () => Array.from(new Set(NOTARIES.map((n) => n.district))).sort(),
        []
    );
    const dates = useMemo(
        () => Array.from(new Set(NOTARIES.map((n) => n.issueDate))).sort(),
        []
    );

    // Stats
    const stats = useMemo(() => {
        const total = NOTARIES.length;
        const active = NOTARIES.filter((n) => String(n.issueDate).includes("2025"))
            .length;
        const regionsCount = new Set(NOTARIES.map((n) => n.region)).size;
        const districtsCount = new Set(NOTARIES.map((n) => n.district)).size;
        return { total, active, regionsCount, districtsCount };
    }, []);

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        const regionValue = region;
        const districtValue = district;
        const dateValue = issueDate;

        const anyFilter = Boolean(s || regionValue || districtValue || dateValue);
        setHasSearched(anyFilter);

        if (!anyFilter) return [];

        const base = NOTARIES.filter((n) => {
            const matchesSearch =
                !s ||
                n.name.toLowerCase().includes(s) ||
                n.notaryName.toLowerCase().includes(s) ||
                n.district.toLowerCase().includes(s);

            const matchesRegion = !regionValue || n.region === regionValue;
            const matchesDistrict = !districtValue || n.district === districtValue;
            const matchesDate = !dateValue || n.issueDate === dateValue;

            return matchesSearch && matchesRegion && matchesDistrict && matchesDate;
        });

        const sorted = [...base].sort((a, b) => {
            let aValue = a[sortColumn];
            let bValue = b[sortColumn];

            if (sortColumn === "id") {
                aValue = Number(aValue);
                bValue = Number(bValue);
            } else {
                aValue = String(aValue ?? "").toLowerCase();
                bValue = String(bValue ?? "").toLowerCase();
            }

            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        return sorted;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, region, district, issueDate, sortColumn, sortDirection]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, region, district, issueDate]);

    const totalPages = useMemo(() => {
        return Math.ceil(filtered.length / rowsPerPage) || 0;
    }, [filtered.length]);

    const paginated = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filtered.slice(startIndex, endIndex);
    }, [filtered, currentPage]);

    const onSort = (col) => {
        if (!hasSearched || filtered.length === 0) return;

        if (sortColumn === col) {
            setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortColumn(col);
            setSortDirection("asc");
        }
    };

    const SortIcon = ({ col }) => {
        if (sortColumn !== col) return null;
        return (
            <span className="ml-1 text-xs">
                {sortDirection === "asc" ? "▲" : "▼"}
            </span>
        );
    };

    const canPrev = hasSearched && filtered.length > 0 && currentPage > 1;
    const canNext =
        hasSearched && filtered.length > 0 && currentPage < totalPages;

    return (
        <div className="min-h-screen bg-white text-black">
            
            <div className="mx-auto max-w-8xl px-4 py-8">
                {/* Header */}
                <div className="rounded-2xl bg-black px-6 py-6 text-white shadow-sm">
                    <h1 className="text-2xl font-extrabold md:text-3xl">
                        Somalia Notary Public Directory
                    </h1>
                    <p className="mt-1 text-sm text-white/80">
                        Registry of notary publics across Somalia
                    </p>
                </div>

                {/* Filters */}
                <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                        <div className="md:col-span-5">
                            <label className="mb-1 block text-sm font-semibold text-black/80">
                                Search Notaries
                            </label>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={inputClass}
                                placeholder="Search by name, notary name, or district..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-semibold text-black/80">
                                Region
                            </label>
                            <select
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className={selectClass}
                            >
                                <option value="">All Regions</option>
                                {regions.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-3">
                            <label className="mb-1 block text-sm font-semibold text-black/80">
                                District
                            </label>
                            <select
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className={selectClass}
                            >
                                <option value="">All Districts</option>
                                {districts.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-semibold text-black/80">
                                Issue Date
                            </label>
                            <select
                                value={issueDate}
                                onChange={(e) => setIssueDate(e.target.value)}
                                className={selectClass}
                            >
                                <option value="">All Dates</option>
                                {dates.map((dt) => (
                                    <option key={dt} value={dt}>
                                        {dt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <StatCard value={stats.total} label="Total Notaries" />
                    <StatCard value={stats.active} label="Active Notaries" />
                    <StatCard value={stats.regionsCount} label="Regions" />
                    <StatCard value={stats.districtsCount} label="Districts" />
                </div>

                {/* Table */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th
                                        className="cursor-pointer px-4 py-3 font-semibold"
                                        onClick={() => onSort("id")}
                                    >
                                        ID <SortIcon col="id" />
                                    </th>
                                    <th
                                        className="cursor-pointer px-4 py-3 font-semibold"
                                        onClick={() => onSort("name")}
                                    >
                                        Full Name <SortIcon col="name" />
                                    </th>
                                    <th
                                        className="cursor-pointer px-4 py-3 font-semibold"
                                        onClick={() => onSort("notaryName")}
                                    >
                                        Notary Name <SortIcon col="notaryName" />
                                    </th>
                                    <th
                                        className="cursor-pointer px-4 py-3 font-semibold"
                                        onClick={() => onSort("district")}
                                    >
                                        District <SortIcon col="district" />
                                    </th>
                                    <th
                                        className="cursor-pointer px-4 py-3 font-semibold"
                                        onClick={() => onSort("region")}
                                    >
                                        Region <SortIcon col="region" />
                                    </th>
                                    <th
                                        className="cursor-pointer px-4 py-3 font-semibold"
                                        onClick={() => onSort("issueDate")}
                                    >
                                        Issue Date <SortIcon col="issueDate" />
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {!hasSearched ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-10 text-center text-black/70"
                                        >
                                            Please enter a search term to find notaries
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-10 text-center text-black/70"
                                        >
                                            No notaries found matching your search criteria
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((n, idx) => (
                                        <tr
                                            key={n.id}
                                            className={
                                                idx % 2 === 0
                                                    ? "border-t border-black/5 bg-white"
                                                    : "border-t border-black/5 bg-black/[0.02]"
                                            }
                                        >
                                            <td className="px-4 py-3">{n.id}</td>
                                            <td className="px-4 py-3">{n.name}</td>
                                            <td className="px-4 py-3">{n.notaryName}</td>
                                            <td className="px-4 py-3">{n.district}</td>
                                            <td className="px-4 py-3">{n.region}</td>
                                            <td className="px-4 py-3">{n.issueDate}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                        onClick={() => canPrev && setCurrentPage((p) => p - 1)}
                        disabled={!canPrev}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${canPrev
                                ? "bg-black text-white hover:bg-black/90"
                                : "cursor-not-allowed bg-black/10 text-black/40"
                            }`}
                    >
                        Previous
                    </button>

                    <div className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm shadow-sm">
                        Page {hasSearched ? currentPage : 1} of{" "}
                        {hasSearched ? totalPages || 1 : 1}
                    </div>

                    <button
                        onClick={() => canNext && setCurrentPage((p) => p + 1)}
                        disabled={!canNext}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${canNext
                                ? "bg-black text-white hover:bg-black/90"
                                : "cursor-not-allowed bg-black/10 text-black/40"
                            }`}
                    >
                        Next
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-10 border-t border-black/10 pt-6 text-center text-sm text-black/70">
                    © {year} Somalia Notary Public Directory | Data as of latest update
                </div>
            </div>
        </div>
    );
}