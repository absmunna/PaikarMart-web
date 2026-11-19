export interface BangladeshDivision {
  id: string;
  nameEn: string;
  nameBn: string;
  lat: number;
  lng: number;
}

export interface CommercialHub {
  id: string;
  nameBn: string;
  nameEn: string;
  areaBn: string;
  districtBn: string;
  divisionId: string;
  tag: string;
  lat: number;
  lng: number;
}

export const BANGLADESH_DIVISIONS: BangladeshDivision[] = [
  { id: 'dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা বিভাগ', lat: 23.8103, lng: 90.4125 },
  { id: 'chattogram', nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম বিভাগ', lat: 22.3569, lng: 91.7832 },
  { id: 'sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট বিভাগ', lat: 24.8949, lng: 91.8687 },
  { id: 'rajshahi', nameEn: 'Rajshahi', nameBn: 'রাজশাহী বিভাগ', lat: 24.3636, lng: 88.6241 },
  { id: 'khulna', nameEn: 'Khulna', nameBn: 'খুলনা বিভাগ', lat: 22.8456, lng: 89.5403 },
  { id: 'barishal', nameEn: 'Barishal', nameBn: 'বরিশাল বিভাগ', lat: 22.7010, lng: 90.3535 },
  { id: 'rangpur', nameEn: 'Rangpur', nameBn: 'রংপুর বিভাগ', lat: 25.7439, lng: 89.2752 },
  { id: 'mymensingh', nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ বিভাগ', lat: 24.7471, lng: 90.4203 }
];

export const POPULAR_COMMERCIAL_HUBS: CommercialHub[] = [
  // Dhaka Commercial & Wholesale Hubs
  { id: 'dhaka-keraniganj', nameBn: 'কেরানীগঞ্জ গার্মেন্টস আড়ত', nameEn: 'Keraniganj Garments Hub', areaBn: 'কেরানীগঞ্জ', districtBn: 'ঢাকা', divisionId: 'dhaka', tag: 'পোশাক পাইকারি', lat: 23.6844, lng: 90.3789 },
  { id: 'dhaka-islampur', nameBn: 'ইসলামপুর থান কাপড় মার্কেট', nameEn: 'Islampur Fabric Market', areaBn: 'ইসলামপুর', districtBn: 'ঢাকা', divisionId: 'dhaka', tag: 'টেক্সটাইল পাইকারি', lat: 23.7089, lng: 90.4042 },
  { id: 'dhaka-chawkbazar', nameBn: 'চকবাজার পাইকারি মার্কেট', nameEn: 'Chawkbazar Wholesale Market', areaBn: 'চকবাজার', districtBn: 'ঢাকা', divisionId: 'dhaka', tag: 'কসমেটিক্স ও প্লাস্টিক', lat: 23.7161, lng: 90.3956 },
  { id: 'dhaka-babubazar', nameBn: 'বাবুবাজার চালের আড়ত', nameEn: 'Babubazar Rice Wholesale', areaBn: 'বাবুবাজার', districtBn: 'ঢাকা', divisionId: 'dhaka', tag: 'খাদ্য ও আড়ত', lat: 23.7100, lng: 90.4020 },
  { id: 'dhaka-kawranbazar', nameBn: 'কারওয়ান বাজার কাঁচাবাজার আড়ত', nameEn: 'Kawran Bazar Produce Hub', areaBn: 'কারওয়ান বাজার', districtBn: 'ঢাকা', divisionId: 'dhaka', tag: 'কাঁচামাল আড়ত', lat: 23.7516, lng: 90.3938 },
  { id: 'dhaka-motijheel', nameBn: 'মতিঝিল বাণিজ্যিক এলাকা', nameEn: 'Motijheel Commercial Area', areaBn: 'মতিঝিল', districtBn: 'ঢাকা', divisionId: 'dhaka', tag: 'করপোরেট হাব', lat: 23.7330, lng: 90.4172 },
  { id: 'dhaka-mirpur', nameBn: 'মিরপুর শপিং ও আবাসিক জোন', nameEn: 'Mirpur Hub', areaBn: 'মিরপুর-১০', districtBn: 'ঢাকা', divisionId: 'dhaka', tag: 'হাইপারলোকাল জোন', lat: 23.8070, lng: 90.3686 },
  { id: 'dhaka-uttara', nameBn: 'উত্তরা এয়ারপোর্ট জোন', nameEn: 'Uttara Hub', areaBn: 'উত্তরা', districtBn: 'ঢাকা', divisionId: 'dhaka', tag: 'হাইপারলোকাল জোন', lat: 23.8759, lng: 90.3795 },
  { id: 'dhaka-gulshan', nameBn: 'গুলশান ও বনানী প্রিমিয়াম জোন', nameEn: 'Gulshan & Banani Zone', areaBn: 'গুলশান', districtBn: 'ঢাকা', divisionId: 'dhaka', tag: 'লাইফস্টাইল জোন', lat: 23.7925, lng: 90.4078 },
  { id: 'dhaka-dhanmondi', nameBn: 'ধানমন্ডি লেক ও রিটেইল জোন', nameEn: 'Dhanmondi Retail Hub', areaBn: 'ধানমন্ডি', districtBn: 'ঢাকা', divisionId: 'dhaka', tag: 'খুচরা ও ক্যাফে', lat: 23.7465, lng: 90.3760 },
  { id: 'dhaka-tongi', nameBn: 'টঙ্গী শিল্পাঞ্চল', nameEn: 'Tongi Industrial Area', areaBn: 'টঙ্গী', districtBn: 'গাজীপুর', divisionId: 'dhaka', tag: 'ফ্যাক্টরি ও মিলস', lat: 23.8967, lng: 90.4032 },
  { id: 'dhaka-narayanganj', nameBn: 'নারায়ণগঞ্জ নিটিং ও হোসিয়ারি', nameEn: 'Narayanganj Hosiery Hub', areaBn: 'নারায়ণগঞ্জ সদর', districtBn: 'নারায়ণগঞ্জ', divisionId: 'dhaka', tag: 'টেক্সটাইল মিলস', lat: 23.6238, lng: 90.5000 },

  // Chattogram Commercial & Wholesale Hubs
  { id: 'ctg-khatunganj', nameBn: 'খাতুনগঞ্জ ভোগ্যপণ্য আড়ত', nameEn: 'Khatunganj Commodity Hub', areaBn: 'খাতুনগঞ্জ', districtBn: 'চট্টগ্রাম', divisionId: 'chattogram', tag: 'কমোডিটি আড়ত', lat: 22.3392, lng: 91.8384 },
  { id: 'ctg-agrabad', nameBn: 'আগ্রাবাদ কমার্শিয়াল এরিয়া', nameEn: 'Agrabad Commercial Area', areaBn: 'আগ্রাবাদ', districtBn: 'চট্টগ্রাম', divisionId: 'chattogram', tag: 'করপোরেট ও শিপিং', lat: 22.3275, lng: 91.8122 },
  { id: 'ctg-gec', nameBn: 'জিইসি ও নাসিরাবাদ জোন', nameEn: 'GEC & Nasirabad Zone', areaBn: 'জিইসি মোড়', districtBn: 'চট্টগ্রাম', divisionId: 'chattogram', tag: 'খুচরা মার্কেট', lat: 22.3591, lng: 91.8219 },

  // Sylhet Hubs
  { id: 'sylhet-zindabazar', nameBn: 'জিন্দাবাজার রিটেইল সেন্টার', nameEn: 'Zindabazar Retail Hub', areaBn: 'জিন্দাবাজার', districtBn: 'সিলেট', divisionId: 'sylhet', tag: 'সেন্ট্রাল মার্কেট', lat: 24.8978, lng: 91.8714 },

  // Rajshahi Hubs
  { id: 'raj-shaheb-bazar', nameBn: 'সাহেব বাজার সিল্ক ও কৃষি আড়ত', nameEn: 'Shaheb Bazar Silk & Agro Hub', areaBn: 'সাহেব বাজার', districtBn: 'রাজশাহী', divisionId: 'rajshahi', tag: 'সিল্ক ও আম আড়ত', lat: 24.3667, lng: 88.6000 },

  // Khulna Hubs
  { id: 'khulna-daulatpur', nameBn: 'দৌলতপুর পাট ও কৃষি মোকাম', nameEn: 'Daulatpur Jute & Agro Hub', areaBn: 'দৌলতপুর', districtBn: 'খুলনা', divisionId: 'khulna', tag: 'পাট ও মৎস্য মোকাম', lat: 22.8800, lng: 89.5200 },

  // Barishal Hubs
  { id: 'bar-chowkbazar', nameBn: 'নথুল্লাবাদ ও চকবাজার আড়ত', nameEn: 'Nathullabad & Chawkbazar Hub', areaBn: 'চকবাজার', districtBn: 'বরিশাল', divisionId: 'barishal', tag: 'ধান ও নদী বন্দর', lat: 22.7050, lng: 90.3600 },

  // Rangpur Hubs
  { id: 'rang-jahaj-company', nameBn: 'জাহাজ কোম্পানি মোড় কমার্শিয়াল', nameEn: 'Jahaj Company More Hub', areaBn: 'জাহাজ কোম্পানি মোড়', districtBn: 'রংপুর', divisionId: 'rangpur', tag: 'বাণিজ্যিক এলাকা', lat: 25.7480, lng: 89.2500 },

  // Mymensingh Hubs
  { id: 'mym-ganginarpar', nameBn: 'গাঙ্গিনারপাড় প্রধান বাজার', nameEn: 'Ganginarpar Central Market', areaBn: 'গাঙ্গিনারপাড়', districtBn: 'ময়মনসিংহ', divisionId: 'mymensingh', tag: 'প্রধান বাজার', lat: 24.7550, lng: 90.4070 }
];
