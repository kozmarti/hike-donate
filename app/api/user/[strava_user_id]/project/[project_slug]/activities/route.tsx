import clientPromise from "@/lib/mongodb";

import { NextRequest, NextResponse } from "next/server";

export interface Activity {
  strava_user_id: number;
  start_time: Date;
  strava_project_name: string;
  moving_time: number; // seconds
  coordinates: number[][];
  strava_activity_id: number;
  strava_photo_urls: string[];
  altitudes: number[]; //metre
  delta_altitudes: number[]; //metre
  distances: number[]; //metre
  delta_distances: number[]; //metre
  total_distance: number; //metre
  min_altitude: number; //metre
  max_altitude: number; //metre
  tota_elevation_gain: number;
  total_elevation_loss: number; //metre
  polyline: string; //metre
}

export async function GET(
  req: NextRequest,
  { params }: { params: { strava_user_id: number; project_slug: string } }
) {
  // endpoint: api/user/{strava_user_id}/project/{project_slug}/activities

  const { strava_user_id, project_slug } = params;


  try {
    const client = await clientPromise;
    const db = client.db("hike");
    const activities = await db
      .collection("activities")
      .find({
        strava_user_id: parseInt((process.env.STRAVA_USER_ID ??= "")),
        strava_project_name: process.env.STRAVA_PROJECT_NAME,
      })
      .toArray();
    return NextResponse.json(activities);
  } catch (e) {
    console.error(e);
  }
}

export async function POST(request: Request) {
  const activityData:Activity = await request.json();

  return Response.json({ message: "Hello world", activityData });
}


const h = {strava_user_id: 147153150,
strava_activity_id: parseInt(12431737609),
start_time: new Date("2024-09-17T12:36:52.000Z"),
strava_project_name: 'test',
moving_time: 2616,
total_distance: 6354.3,
min_altitude: 4.5,
max_altitude: 9.4,
polyline: 'egtpGjmmBKFMRCAQRKLMZIJKHKRIBY^GDWj@UVa@ZEJg@?UJM?GB[?{@Rw@f@SRCFWNSTOLQBOVWLGAMNKDEFa@XWFIJQ@SFQJO@MFEHI?a@N[DGD]DqAl@G@UHM@MLEAe@NSDMJSDQC]NaB^AFMBGDMAUHKAODM?eAXKA[JU@GBO?o@J_@Jw@HBBA@QDGAo@REA_@Fk@?YHGAg@FYAKB]@SBOCIB]Hc@Aa@@WCk@?FECAC@GAaA@SCCMBMASCKIGGAIEO]c@OKGIISIUGEEe@OKI[IiAe@QO]SB@a@SUEKMi@Wc@Q_@m@]_@SMmA{Aa@[?EUc@e@o@MI}@gAQ[[[u@gA[YKUeAwAKUQWIEQYEK_@g@yAmCGQKM_AmBk@sAIMGEg@mAGKK[{BkF]}@COS_@Oo@s@qBW{@wAyDUy@c@mAMWW}@Uc@ESi@uAQs@m@kBOUe@gAKo@k@uASo@CSWi@Sq@IACF@HRP?FJ\\T`@AGEHTl@T`@zApEnA|CX|@?P^x@\\`ADPLVf@pAZhAh@xAHZTf@Rt@j@xAhAlDJHnAzCH^HPf@hAbAtBBHfAnB`@`AHJlBlDj@z@\\b@HBn@~@r@`AFNJJf@t@LLx@hA|@fAPLz@hAZXNTBJrA~AF@\\Vp@ZTFJHJ?z@d@`@Zf@LDHND^TJBr@Zt@d@THVVZDHCFF\\BLCTFRAHDNAFEJD\\@bBX`@BPDH?PRJCK?ECEH@Gn@Ud@?b@DTAJGVCrAW|AOFEzAYZKx@G`@GXOpAS^CBAJMv@SfAa@z@Un@UVMZGb@S`AYPKtAc@VOp@MFGLCVQB?PQXGX@NETYXSXYz@o@`@UTIH?^Ir@?R_@DAl@m@Zc@HYV[JUBCLNJBu@XEC',
strava_photo_urls: [
  'https://dgtzuqphqg23d.cloudfront.net/VLVrAJKqgrFhXv3ZkMBMguX41NbTIuAz3Ap_qSAz5KM-2048x2048.jpg',
  'https://dgtzuqphqg23d.cloudfront.net/XHQe2GWQq-J6tHBUbVmn52NJxf7Moy5rnrq1IUU1xa0-2048x2048.jpg',
  'https://dgtzuqphqg23d.cloudfront.net/lXfuBO9hehistImo4jvZx-VIuJMCYetjRk4aPeP7Txo-2048x2048.jpg'
],
coordinates: [
  [ 44.837154, -0.5655 ],
  [ 44.837173, -0.565518 ],
  [ 44.837204, -0.56553 ],
  [ 44.837217, -0.565534 ],
  [ 44.837235, -0.56556 ],
  [ 44.837237, -0.565561 ],
  [ 44.837242, -0.56557 ],
  [ 44.837247, -0.565579 ],
  [ 44.837258, -0.565601 ],
  [ 44.837278, -0.56562 ],
  [ 44.83728, -0.565637 ],
  [ 44.837303, -0.565628 ],
  [ 44.837299, -0.565625 ],
  [ 44.837313, -0.565649 ],
  [ 44.837333, -0.565666 ],
  [ 44.837344, -0.56567 ],
  [ 44.837358, -0.565688 ],
  [ 44.837372, -0.565705 ],
  [ 44.837392, -0.565722 ],
  [ 44.837408, -0.565741 ],
  [ 44.837423, -0.565759 ],
  [ 44.837439, -0.565778 ],
  [ 44.837454, -0.565796 ],
  [ 44.837462, -0.56583 ],
  [ 44.837472, -0.565847 ],
  [ 44.837481, -0.565865 ],
  [ 44.837513, -0.565913 ],
  [ 44.837521, -0.565938 ],
  [ 44.837556, -0.565982 ],
  [ 44.83757, -0.566 ],
  [ 44.837584, -0.566017 ],
  [ 44.837625, -0.566038 ],
  [ 44.837637, -0.566047 ],
  [ 44.837669, -0.56609 ],
  [ 44.83768, -0.566116 ],
  [ 44.837691, -0.566142 ],
  [ 44.837733, -0.566163 ],
  [ 44.837749, -0.566163 ],
  [ 44.837782, -0.566212 ],
  [ 44.837796, -0.566235 ],
  [ 44.83781, -0.566257 ],
  [ 44.837851, -0.566288 ],
  [ 44.837861, -0.566309 ],
  [ 44.83787, -0.566329 ],
  [ 44.837897, -0.566356 ],
  [ 44.837913, -0.566359 ],
  [ 44.837939, -0.566408 ],
  [ 44.837949, -0.566426 ],
  [ 44.83796, -0.566445 ],
  [ 44.837986, -0.56651 ],
  [ 44.837992, -0.56652 ],
  [ 44.838019, -0.566557 ],
  [ 44.838031, -0.566572 ],
  [ 44.838044, -0.566587 ],
  [ 44.838072, -0.566621 ],
  [ 44.838082, -0.566632 ],
  [ 44.838117, -0.566657 ],
  [ 44.83813, -0.566674 ],
  [ 44.838142, -0.566692 ],
  [ 44.838176, -0.566719 ],
  [ 44.83819, -0.566729 ],
  [ 44.838204, -0.566739 ],
  [ 44.838239, -0.566771 ],
  [ 44.838247, -0.566782 ],
  [ 44.83828, -0.566818 ],
  [ 44.838296, -0.566827 ],
  [ 44.838312, -0.566835 ],
  [ 44.838332, -0.566887 ],
  [ 44.838341, -0.566899 ],
  [ 44.838386, -0.566899 ],
  [ 44.838403, -0.5669 ],
  [ 44.83842, -0.566901 ],
  [ 44.838456, -0.566903 ],
  [ 44.838468, -0.5669 ],
  [ 44.83851, -0.566901 ],
  [ 44.838528, -0.566901 ],
  [ 44.838546, -0.5669 ],
  [ 44.838582, -0.566925 ],
  [ 44.838596, -0.56693 ],
  [ 44.83861, -0.566936 ],
  [ 44.838644, -0.566944 ],
  [ 44.838655, -0.566952 ],
  [ 44.838693, -0.56695 ],
  [ 44.838706, -0.566952 ],
  [ 44.83872, -0.566953 ],
  [ 44.838753, -0.566961 ],
  [ 44.838762, -0.566973 ],
  [ 44.83881, -0.566967 ],
  [ 44.838828, -0.566967 ],
  [ 44.838845, -0.566967 ],
  [ 44.838886, -0.566969 ],
  [ 44.8389, -0.566971 ],
  [ 44.838942, -0.566984 ],
  [ 44.838959, -0.566986 ],
  [ 44.838976, -0.566988 ],
  [ 44.839017, -0.567007 ],
  [ 44.839034, -0.567015 ],
  [ 44.83905, -0.567023 ],
  [ 44.839085, -0.567039 ],
  [ 44.839097, -0.567042 ]
],
altitudes: [
  9.4, 9.3, 9.2, 9.1,   9,   9,   9,   9, 8.9, 8.8, 8.7, 8.6,
  8.6, 8.5, 8.5, 8.4, 8.3, 8.3, 8.2, 8.1,   8,   8, 7.9, 7.8,
  7.7, 7.7, 7.5, 7.4, 7.3, 7.2, 7.1,   7, 6.9, 6.7, 6.7, 6.6,
  6.5, 6.5, 6.3, 6.3, 6.2, 6.1,   6,   6, 5.9, 5.8, 5.7, 5.7,
  5.6, 5.5, 5.5, 5.4, 5.4, 5.4, 5.3, 5.2, 5.2, 5.1, 5.1, 5.1,
    5,   5,   5,   5, 4.9, 4.9, 4.9, 4.9, 4.9, 4.8, 4.8, 4.8,
  4.8, 4.8, 4.8, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7,
  4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.8, 4.8, 4.8, 4.8,
  4.8, 4.8, 4.8, 4.8
],
distances: [
      0,     0,     0,     0,   3.3,   5.3,   7.3,   9.3,   9.3,
   11.8,  11.8,  11.8,  15.8,  15.8,  19.1,    21,  22.8,  24.7,
   26.2,  27.7,  29.2,  30.8,  32.3,  34.6,  36.8,  39.1,  42.3,
   45.4,  48.2,    51,  53.8,  57.8,  61.8,  64.4,    67,  69.7,
   73.8,  77.9,  80.5,  83.1,  85.8,  88.5,  91.2,  93.9,  97.8,
  101.6, 103.8, 105.9, 108.1, 111.9, 115.7, 118.6, 121.6, 124.6,
    128, 131.3, 133.6,   136, 138.3, 140.7,   143, 145.3, 148.7,
  152.1, 154.3, 156.5, 158.7, 162.1, 165.5,   168, 170.5,   173,
  176.4, 179.9, 182.1, 184.3, 186.6,   189, 191.4, 193.8, 197.4,
    201, 203.2, 205.3, 207.4, 210.7, 213.9,   216, 218.1, 220.2,
  223.6, 226.9, 229.6, 232.2, 234.8, 237.4, 239.9, 242.5, 246.3,
    250
],
delta_altitudes: [
  -0.1, -0.1, -0.1, -0.1,    0,    0,    0, -0.1, -0.1, -0.1, -0.1,    0,
  -0.1,    0, -0.1, -0.1,    0, -0.1, -0.1, -0.1,    0, -0.1, -0.1, -0.1,
     0, -0.2, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.2,    0, -0.1, -0.1,
     0, -0.2,    0, -0.1, -0.1, -0.1,    0, -0.1, -0.1, -0.1,    0, -0.1,
  -0.1,    0, -0.1,    0,    0, -0.1, -0.1,    0, -0.1,    0,    0, -0.1,
     0,    0,    0, -0.1,    0,    0,    0,    0, -0.1,    0,    0,    0,
     0,    0,    0, -0.1,    0,    0,    0,    0,    0,    0,    0,    0,
     0,    0,    0,    0,    0,    0,    0,  0.1,    0,    0,    0,    0,
     0,    0,    0,    0
],
delta_distances: [
    0,   0,   0, 3.3,   2,   2,   2,   0, 2.5,   0,   0,   4,
    0, 3.3, 1.9, 1.8, 1.9, 1.5, 1.5, 1.5, 1.6, 1.5, 2.3, 2.2,
  2.3, 3.2, 3.1, 2.8, 2.8, 2.8,   4,   4, 2.6, 2.6, 2.7, 4.1,
  4.1, 2.6, 2.6, 2.7, 2.7, 2.7, 2.7, 3.9, 3.8, 2.2, 2.1, 2.2,
  3.8, 3.8, 2.9,   3,   3, 3.4, 3.3, 2.3, 2.4, 2.3, 2.4, 2.3,
  2.3, 3.4, 3.4, 2.2, 2.2, 2.2, 3.4, 3.4, 2.5, 2.5, 2.5, 3.4,
  3.5, 2.2, 2.2, 2.3, 2.4, 2.4, 2.4, 3.6, 3.6, 2.2, 2.1, 2.1,
  3.3, 3.2, 2.1, 2.1, 2.1, 3.4, 3.3, 2.7, 2.6, 2.6, 2.6, 2.5,
  2.6, 3.8, 3.7, 2.4
],
total_elevation_loss: -10.1,
tota_elevation_gain: 7.2
}
