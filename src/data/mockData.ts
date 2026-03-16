// ============================================================
// BOOKITO ERP — Mock Data
// ============================================================

// ---------- Hierarchy ----------
export interface LocationNode {
  id: string
  name: string
  children?: LocationNode[]
}

// All Indian states and union territories as top-level folders.
// For now, detailed districts are provided for a few demo states.
export const locationHierarchy: LocationNode[] = [
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    children: [
      { id: 'srikakulam', name: 'Srikakulam', children: [] },
      { id: 'parvathipuram-manyam', name: 'Parvathipuram Manyam', children: [] },
      { id: 'vizianagaram', name: 'Vizianagaram', children: [] },
      { id: 'visakhapatnam', name: 'Visakhapatnam', children: [] },
      { id: 'alluri-sitharama-raju', name: 'Alluri Sitharama Raju', children: [] },
      { id: 'anakapalli', name: 'Anakapalli', children: [] },
      { id: 'polavaram', name: 'Polavaram', children: [] },
      { id: 'kakinada', name: 'Kakinada', children: [] },
      { id: 'east-godavari', name: 'East Godavari', children: [] },
      { id: 'konaseema', name: 'Dr. B. R. Ambedkar Konaseema', children: [] },
      { id: 'eluru', name: 'Eluru', children: [] },
      { id: 'west-godavari', name: 'West Godavari', children: [] },
      { id: 'ntr', name: 'NTR', children: [] },
      { id: 'krishna', name: 'Krishna', children: [] },
      { id: 'palnadu', name: 'Palnadu', children: [] },
      { id: 'guntur', name: 'Guntur', children: [] },
      { id: 'bapatla', name: 'Bapatla', children: [] },
      { id: 'prakasam', name: 'Prakasam', children: [] },
      { id: 'markapuram', name: 'Markapuram', children: [] },
      { id: 'sri-potti-sriramulu-nellore', name: 'Sri Potti Sriramulu Nellore', children: [] },
      { id: 'kurnool', name: 'Kurnool', children: [] },
      { id: 'nandyal', name: 'Nandyal', children: [] },
      { id: 'ananthapuramu', name: 'Ananthapuramu', children: [] },
      { id: 'sri-sathya-sai', name: 'Sri Sathya Sai', children: [] },
      { id: 'ysr-kadapa', name: 'YSR Kadapa', children: [] },
      { id: 'annamayya', name: 'Annamayya', children: [] },
      { id: 'tirupati', name: 'Tirupati', children: [] },
      { id: 'chittoor', name: 'Chittoor', children: [] },
    ],
  },
  {
    id: 'arunachal-pradesh',
    name: 'Arunachal Pradesh',
    children: [
      { id: 'tawang', name: 'Tawang', children: [] },
      { id: 'west-kameng', name: 'West Kameng', children: [] },
      { id: 'bichom', name: 'Bichom', children: [] },
      { id: 'east-kameng', name: 'East Kameng', children: [] },
      { id: 'pakke-kessang', name: 'Pakke-Kessang', children: [] },
      { id: 'kurung-kumey', name: 'Kurung Kumey', children: [] },
      { id: 'papum-pare', name: 'Papum Pare', children: [] },
      { id: 'kra-daadi', name: 'Kra Daadi', children: [] },
      { id: 'lower-subansiri', name: 'Lower Subansiri', children: [] },
      { id: 'kamle', name: 'Kamle', children: [] },
      { id: 'keyi-panyor', name: 'Keyi Panyor', children: [] },
      { id: 'upper-subansiri', name: 'Upper Subansiri', children: [] },
      { id: 'shi-yomi', name: 'Shi Yomi', children: [] },
      { id: 'west-siang', name: 'West Siang', children: [] },
      { id: 'siang', name: 'Siang', children: [] },
      { id: 'lower-siang', name: 'Lower Siang', children: [] },
      { id: 'lepa-rada', name: 'Lepa Rada', children: [] },
      { id: 'upper-siang', name: 'Upper Siang', children: [] },
      { id: 'east-siang', name: 'East Siang', children: [] },
      { id: 'dibang-valley', name: 'Dibang Valley', children: [] },
      { id: 'lower-dibang-valley', name: 'Lower Dibang Valley', children: [] },
      { id: 'anjaw', name: 'Anjaw', children: [] },
      { id: 'lohit', name: 'Lohit', children: [] },
      { id: 'namsai', name: 'Namsai', children: [] },
      { id: 'changlang', name: 'Changlang', children: [] },
      { id: 'tirap', name: 'Tirap', children: [] },
      { id: 'longding', name: 'Longding', children: [] },
    ],
  },
  {
    id: 'assam',
    name: 'Assam',
    children: [
      { id: 'baksa', name: 'Baksa', children: [] },
      { id: 'bajali', name: 'Bajali', children: [] },
      { id: 'barpeta', name: 'Barpeta', children: [] },
      { id: 'biswanath', name: 'Biswanath', children: [] },
      { id: 'bongaigaon', name: 'Bongaigaon', children: [] },
      { id: 'cachar', name: 'Cachar', children: [] },
      { id: 'charaideo', name: 'Charaideo', children: [] },
      { id: 'chirang', name: 'Chirang', children: [] },
      { id: 'darrang', name: 'Darrang', children: [] },
      { id: 'dhemaji', name: 'Dhemaji', children: [] },
      { id: 'dhubri', name: 'Dhubri', children: [] },
      { id: 'dibrugarh', name: 'Dibrugarh', children: [] },
      { id: 'dima-hasao', name: 'Dima Hasao', children: [] },
      { id: 'goalpara', name: 'Goalpara', children: [] },
      { id: 'golaghat', name: 'Golaghat', children: [] },
      { id: 'hailakandi', name: 'Hailakandi', children: [] },
      { id: 'hojai', name: 'Hojai', children: [] },
      { id: 'jorhat', name: 'Jorhat', children: [] },
      { id: 'kamrup-metropolitan', name: 'Kamrup Metropolitan', children: [] },
      { id: 'kamrup', name: 'Kamrup', children: [] },
      { id: 'karbi-anglong', name: 'Karbi Anglong', children: [] },
      { id: 'karimganj', name: 'Karimganj', children: [] },
      { id: 'kokrajhar', name: 'Kokrajhar', children: [] },
      { id: 'lakhimpur', name: 'Lakhimpur', children: [] },
      { id: 'majuli', name: 'Majuli', children: [] },
      { id: 'morigaon', name: 'Morigaon', children: [] },
      { id: 'nagaon', name: 'Nagaon', children: [] },
      { id: 'nalbari', name: 'Nalbari', children: [] },
      { id: 'sivasagar', name: 'Sivasagar', children: [] },
      { id: 'sonitpur', name: 'Sonitpur', children: [] },
      { id: 'south-salmara-mankachar', name: 'South Salmara-Mankachar', children: [] },
      { id: 'tamulpur', name: 'Tamulpur', children: [] },
      { id: 'tinsukia', name: 'Tinsukia', children: [] },
      { id: 'udalguri', name: 'Udalguri', children: [] },
      { id: 'west-karbi-anglong', name: 'West Karbi Anglong', children: [] },
    ],
  },
  {
    id: 'bihar',
    name: 'Bihar',
    children: [
      { id: 'araria', name: 'Araria', children: [] },
      { id: 'arwal', name: 'Arwal', children: [] },
      { id: 'aurangabad-bihar', name: 'Aurangabad', children: [] },
      { id: 'banka', name: 'Banka', children: [] },
      { id: 'begusarai', name: 'Begusarai', children: [] },
      { id: 'bhagalpur', name: 'Bhagalpur', children: [] },
      { id: 'bhojpur', name: 'Bhojpur', children: [] },
      { id: 'buxar', name: 'Buxar', children: [] },
      { id: 'darbhanga', name: 'Darbhanga', children: [] },
      { id: 'east-champaran', name: 'East Champaran', children: [] },
      { id: 'gaya', name: 'Gaya', children: [] },
      { id: 'gopalganj', name: 'Gopalganj', children: [] },
      { id: 'jamui', name: 'Jamui', children: [] },
      { id: 'jehanabad', name: 'Jehanabad', children: [] },
      { id: 'khagaria', name: 'Khagaria', children: [] },
      { id: 'kishanganj', name: 'Kishanganj', children: [] },
      { id: 'kaimur', name: 'Kaimur', children: [] },
      { id: 'katihar', name: 'Katihar', children: [] },
      { id: 'lakhisarai', name: 'Lakhisarai', children: [] },
      { id: 'madhubani', name: 'Madhubani', children: [] },
      { id: 'munger', name: 'Munger', children: [] },
      { id: 'madhepura', name: 'Madhepura', children: [] },
      { id: 'muzaffarpur', name: 'Muzaffarpur', children: [] },
      { id: 'nalanda', name: 'Nalanda', children: [] },
      { id: 'nawada', name: 'Nawada', children: [] },
      { id: 'patna', name: 'Patna', children: [] },
      { id: 'purnia', name: 'Purnia', children: [] },
      { id: 'rohtas', name: 'Rohtas', children: [] },
      { id: 'saharsa', name: 'Saharsa', children: [] },
      { id: 'samastipur', name: 'Samastipur', children: [] },
      { id: 'sheohar', name: 'Sheohar', children: [] },
      { id: 'sheikhpura', name: 'Sheikhpura', children: [] },
      { id: 'saran', name: 'Saran', children: [] },
      { id: 'sitamarhi', name: 'Sitamarhi', children: [] },
      { id: 'supaul', name: 'Supaul', children: [] },
      { id: 'siwan', name: 'Siwan', children: [] },
      { id: 'vaishali', name: 'Vaishali', children: [] },
      { id: 'west-champaran', name: 'West Champaran', children: [] },
    ],
  },
  {
    id: 'chhattisgarh',
    name: 'Chhattisgarh',
    children: [
      { id: 'balod', name: 'Balod', children: [] },
      { id: 'baloda-bazar-bhatapara', name: 'Baloda Bazar-Bhatapara', children: [] },
      { id: 'balrampur', name: 'Balrampur', children: [] },
      { id: 'bastar', name: 'Bastar', children: [] },
      { id: 'bemetara', name: 'Bemetara', children: [] },
      { id: 'bijapur', name: 'Bijapur', children: [] },
      { id: 'bilaspur', name: 'Bilaspur', children: [] },
      { id: 'dantewada', name: 'Dantewada', children: [] },
      { id: 'dhamtari', name: 'Dhamtari', children: [] },
      { id: 'durg', name: 'Durg', children: [] },
      { id: 'gariaband', name: 'Gariaband', children: [] },
      { id: 'gaurella-pendra-marwahi', name: 'Gaurella-Pendra-Marwahi', children: [] },
      { id: 'janjgir-champa', name: 'Janjgir-Champa', children: [] },
      { id: 'jashpur', name: 'Jashpur', children: [] },
      { id: 'kabirdham', name: 'Kabirdham', children: [] },
      { id: 'kanker', name: 'Kanker', children: [] },
      { id: 'kondagaon', name: 'Kondagaon', children: [] },
      { id: 'khairagarh-chhuikhadan-gandai', name: 'Khairagarh-Chhuikhadan-Gandai', children: [] },
      { id: 'korba', name: 'Korba', children: [] },
      { id: 'koriya', name: 'Koriya', children: [] },
      { id: 'mahasamund', name: 'Mahasamund', children: [] },
      { id: 'manendragarh-chirmiri-bharatpur', name: 'Manendragarh-Chirmiri-Bharatpur', children: [] },
      { id: 'mohla-manpur-ambagarh-chowki', name: 'Mohla-Manpur-Ambagarh Chowki', children: [] },
      { id: 'mungeli', name: 'Mungeli', children: [] },
      { id: 'narayanpur', name: 'Narayanpur', children: [] },
      { id: 'raigarh', name: 'Raigarh', children: [] },
      { id: 'raipur', name: 'Raipur', children: [] },
      { id: 'rajnandgaon', name: 'Rajnandgaon', children: [] },
      { id: 'sarangarh-bilaigarh', name: 'Sarangarh-Bilaigarh', children: [] },
      { id: 'sakti', name: 'Sakti', children: [] },
      { id: 'sukma', name: 'Sukma', children: [] },
      { id: 'surajpur', name: 'Surajpur', children: [] },
      { id: 'surguja', name: 'Surguja', children: [] },
    ],
  },
  {
    id: 'goa',
    name: 'Goa',
    children: [
      {
        id: 'north-goa',
        name: 'North Goa',
        children: [],
      },
      {
        id: 'south-goa',
        name: 'South Goa',
        children: [],
      },
    ],
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    children: [
      { id: 'banaskantha', name: 'Banaskantha', children: [] },
      { id: 'aravalli', name: 'Aravalli', children: [] },
      { id: 'patan', name: 'Patan', children: [] },
      { id: 'gandhinagar', name: 'Gandhinagar', children: [] },
      { id: 'mehsana', name: 'Mehsana', children: [] },
      { id: 'sabarkantha', name: 'Sabarkantha', children: [] },
      { id: 'vav-tharad', name: 'Vav-Tharad', children: [] },
      { id: 'ahmedabad', name: 'Ahmedabad', children: [] },
      { id: 'anand', name: 'Anand', children: [] },
      { id: 'chhota-udaipur', name: 'Chhota Udaipur', children: [] },
      { id: 'dahod', name: 'Dahod', children: [] },
      { id: 'kheda', name: 'Kheda', children: [] },
      { id: 'mahisagar', name: 'Mahisagar', children: [] },
      { id: 'panchmahal', name: 'Panchmahal', children: [] },
      { id: 'vadodara', name: 'Vadodara', children: [] },
      { id: 'surat', name: 'Surat', children: [] },
      { id: 'bharuch', name: 'Bharuch', children: [] },
      { id: 'dang', name: 'Dang', children: [] },
      { id: 'narmada', name: 'Narmada', children: [] },
      { id: 'navsari', name: 'Navsari', children: [] },
      { id: 'tapi', name: 'Tapi', children: [] },
      { id: 'valsad', name: 'Valsad', children: [] },
      { id: 'rajkot', name: 'Rajkot', children: [] },
      { id: 'amreli', name: 'Amreli', children: [] },
      { id: 'bhavnagar', name: 'Bhavnagar', children: [] },
      { id: 'botad', name: 'Botad', children: [] },
      { id: 'devbhoomi-dwarka', name: 'Devbhoomi Dwarka', children: [] },
      { id: 'gir-somnath', name: 'Gir Somnath', children: [] },
      { id: 'jamnagar', name: 'Jamnagar', children: [] },
      { id: 'junagadh', name: 'Junagadh', children: [] },
      { id: 'kutch', name: 'Kutch', children: [] },
      { id: 'morbi', name: 'Morbi', children: [] },
      { id: 'porbandar', name: 'Porbandar', children: [] },
      { id: 'surendranagar', name: 'Surendranagar', children: [] },
    ],
  },
  {
    id: 'haryana',
    name: 'Haryana',
    children: [
      { id: 'ambala', name: 'Ambala', children: [] },
      { id: 'kurukshetra', name: 'Kurukshetra', children: [] },
      { id: 'panchkula', name: 'Panchkula', children: [] },
      { id: 'yamunanagar', name: 'Yamunanagar', children: [] },
      { id: 'faridabad', name: 'Faridabad', children: [] },
      { id: 'nuh', name: 'Nuh', children: [] },
      { id: 'palwal', name: 'Palwal', children: [] },
      { id: 'gurugram', name: 'Gurugram', children: [] },
      { id: 'mahendragarh', name: 'Mahendragarh', children: [] },
      { id: 'rewari', name: 'Rewari', children: [] },
      { id: 'hisar', name: 'Hisar', children: [] },
      { id: 'fatehabad', name: 'Fatehabad', children: [] },
      { id: 'jind', name: 'Jind', children: [] },
      { id: 'sirsa', name: 'Sirsa', children: [] },
      { id: 'karnal', name: 'Karnal', children: [] },
      { id: 'kaithal', name: 'Kaithal', children: [] },
      { id: 'panipat', name: 'Panipat', children: [] },
      { id: 'rohtak', name: 'Rohtak', children: [] },
      { id: 'bhiwani', name: 'Bhiwani', children: [] },
      { id: 'charkhi-dadri', name: 'Charkhi Dadri', children: [] },
      { id: 'jhajjar', name: 'Jhajjar', children: [] },
      { id: 'sonipat', name: 'Sonipat', children: [] },
      { id: 'hansi', name: 'Hansi', children: [] },
    ],
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    children: [
      { id: 'bilaspur-hp', name: 'Bilaspur', children: [] },
      { id: 'chamba', name: 'Chamba', children: [] },
      { id: 'hamirpur', name: 'Hamirpur', children: [] },
      { id: 'kangra', name: 'Kangra', children: [] },
      { id: 'kinnaur', name: 'Kinnaur', children: [] },
      { id: 'kullu', name: 'Kullu', children: [] },
      { id: 'lahaul-and-spiti', name: 'Lahaul and Spiti', children: [] },
      { id: 'mandi', name: 'Mandi', children: [] },
      { id: 'shimla', name: 'Shimla', children: [] },
      { id: 'sirmaur', name: 'Sirmaur', children: [] },
      { id: 'solan', name: 'Solan', children: [] },
      { id: 'una', name: 'Una', children: [] },
    ],
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    children: [
      { id: 'bokaro', name: 'Bokaro', children: [] },
      { id: 'chatra', name: 'Chatra', children: [] },
      { id: 'deoghar', name: 'Deoghar', children: [] },
      { id: 'dhanbad', name: 'Dhanbad', children: [] },
      { id: 'dumka', name: 'Dumka', children: [] },
      { id: 'east-singhbhum', name: 'East Singhbhum', children: [] },
      { id: 'garhwa', name: 'Garhwa', children: [] },
      { id: 'giridih', name: 'Giridih', children: [] },
      { id: 'godda', name: 'Godda', children: [] },
      { id: 'gumla', name: 'Gumla', children: [] },
      { id: 'hazaribagh', name: 'Hazaribagh', children: [] },
      { id: 'jamtara', name: 'Jamtara', children: [] },
      { id: 'khunti', name: 'Khunti', children: [] },
      { id: 'koderma', name: 'Koderma', children: [] },
      { id: 'latehar', name: 'Latehar', children: [] },
      { id: 'lohardaga', name: 'Lohardaga', children: [] },
      { id: 'pakur', name: 'Pakur', children: [] },
      { id: 'palamu', name: 'Palamu', children: [] },
      { id: 'ramgarh', name: 'Ramgarh', children: [] },
      { id: 'ranchi', name: 'Ranchi', children: [] },
      { id: 'sahibganj', name: 'Sahibganj', children: [] },
      { id: 'saraikela-kharsawan', name: 'Saraikela-Kharsawan', children: [] },
      { id: 'simdega', name: 'Simdega', children: [] },
      { id: 'west-singhbhum', name: 'West Singhbhum', children: [] },
    ],
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    children: [
      { id: 'bagalkote', name: 'Bagalkote', children: [] },
      { id: 'ballari', name: 'Ballari', children: [] },
      { id: 'belagavi', name: 'Belagavi', children: [] },
      { id: 'bengaluru-rural', name: 'Bengaluru Rural', children: [] },
      { id: 'bengaluru-urban', name: 'Bengaluru Urban', children: [] },
      { id: 'bidar', name: 'Bidar', children: [] },
      { id: 'chamarajanagara', name: 'Chamarajanagara', children: [] },
      { id: 'chikkaballapura', name: 'Chikkaballapura', children: [] },
      { id: 'chikkamagaluru', name: 'Chikkamagaluru', children: [] },
      { id: 'chitradurga', name: 'Chitradurga', children: [] },
      { id: 'dakshina-kannada', name: 'Dakshina Kannada', children: [] },
      { id: 'davanagere', name: 'Davanagere', children: [] },
      { id: 'dharwad', name: 'Dharwad', children: [] },
      { id: 'gadag', name: 'Gadag', children: [] },
      { id: 'hassan', name: 'Hassan', children: [] },
      { id: 'haveri', name: 'Haveri', children: [] },
      { id: 'kalaburagi', name: 'Kalaburagi', children: [] },
      { id: 'kodagu', name: 'Kodagu', children: [] },
      { id: 'kolar', name: 'Kolar', children: [] },
      { id: 'koppal', name: 'Koppal', children: [] },
      { id: 'mandya', name: 'Mandya', children: [] },
      { id: 'mysuru', name: 'Mysuru', children: [] },
      { id: 'raichur', name: 'Raichur', children: [] },
      { id: 'ramanagara', name: 'Ramanagara', children: [] },
      { id: 'shivamogga', name: 'Shivamogga', children: [] },
      { id: 'tumakuru', name: 'Tumakuru', children: [] },
      { id: 'udupi', name: 'Udupi', children: [] },
      { id: 'uttara-kannada', name: 'Uttara Kannada', children: [] },
      { id: 'vijayapura', name: 'Vijayapura', children: [] },
      { id: 'yadgir', name: 'Yadgir', children: [] },
      { id: 'vijayanagara', name: 'Vijayanagara', children: [] },
    ],
  },
  {
    id: 'kerala',
    name: 'Kerala',
    children: [
      {
        id: 'thiruvananthapuram',
        name: 'Thiruvananthapuram',
        children: [],
      },
      {
        id: 'kollam',
        name: 'Kollam',
        children: [],
      },
      {
        id: 'pathanamthitta',
        name: 'Pathanamthitta',
        children: [],
      },
      {
        id: 'alappuzha',
        name: 'Alappuzha',
        children: [],
      },
      {
        id: 'kottayam',
        name: 'Kottayam',
        children: [],
      },
      {
        id: 'idukki',
        name: 'Idukki',
        children: [],
      },
      {
        id: 'ernakulam',
        name: 'Ernakulam',
        children: [],
      },
      {
        id: 'thrissur',
        name: 'Thrissur',
        children: [],
      },
      {
        id: 'palakkad',
        name: 'Palakkad',
        children: [],
      },
      {
        id: 'malappuram',
        name: 'Malappuram',
        children: [],
      },
      {
        id: 'kozhikode',
        name: 'Kozhikode',
        children: [],
      },
      {
        id: 'wayanad',
        name: 'Wayanad',
        children: [],
      },
      {
        id: 'kannur',
        name: 'Kannur',
        children: [],
      },
      {
        id: 'kasaragod',
        name: 'Kasaragod',
        children: [],
      },
    ],
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
        children: [
      { id: 'bhopal', name: 'Bhopal', children: [] },
      { id: 'raisen', name: 'Raisen', children: [] },
      { id: 'rajgarh', name: 'Rajgarh', children: [] },
      { id: 'sehore', name: 'Sehore', children: [] },
      { id: 'vidisha', name: 'Vidisha', children: [] },
      { id: 'morena', name: 'Morena', children: [] },
      { id: 'bhind', name: 'Bhind', children: [] },
      { id: 'sheopur', name: 'Sheopur', children: [] },
      { id: 'gwalior', name: 'Gwalior', children: [] },
      { id: 'ashoknagar', name: 'Ashoknagar', children: [] },
      { id: 'datia', name: 'Datia', children: [] },
      { id: 'guna', name: 'Guna', children: [] },
      { id: 'shivpuri', name: 'Shivpuri', children: [] },
      { id: 'indore', name: 'Indore', children: [] },
      { id: 'alirajpur', name: 'Alirajpur', children: [] },
      { id: 'barwani', name: 'Barwani', children: [] },
      { id: 'burhanpur', name: 'Burhanpur', children: [] },
      { id: 'dhar', name: 'Dhar', children: [] },
      { id: 'jhabua', name: 'Jhabua', children: [] },
      { id: 'khandwa', name: 'Khandwa', children: [] },
      { id: 'khargone', name: 'Khargone', children: [] },
      { id: 'jabalpur', name: 'Jabalpur', children: [] },
      { id: 'balaghat', name: 'Balaghat', children: [] },
      { id: 'chhindwara', name: 'Chhindwara', children: [] },
      { id: 'dindori', name: 'Dindori', children: [] },
      { id: 'katni', name: 'Katni', children: [] },
      { id: 'mandla', name: 'Mandla', children: [] },
      { id: 'narsinghpur', name: 'Narsinghpur', children: [] },
      { id: 'pandhurna', name: 'Pandhurna', children: [] },
      { id: 'seoni', name: 'Seoni', children: [] },
      { id: 'narmadapuram', name: 'Narmadapuram', children: [] },
      { id: 'betul', name: 'Betul', children: [] },
      { id: 'harda', name: 'Harda', children: [] },
      { id: 'rewa', name: 'Rewa', children: [] },
      { id: 'maihar', name: 'Maihar', children: [] },
      { id: 'mauganj', name: 'Mauganj', children: [] },
      { id: 'satna', name: 'Satna', children: [] },
      { id: 'sidhi', name: 'Sidhi', children: [] },
      { id: 'singrauli', name: 'Singrauli', children: [] },
      { id: 'sagar', name: 'Sagar', children: [] },
      { id: 'chhatarpur', name: 'Chhatarpur', children: [] },
      { id: 'damoh', name: 'Damoh', children: [] },
      { id: 'niwari', name: 'Niwari', children: [] },
      { id: 'panna', name: 'Panna', children: [] },
      { id: 'tikamgarh', name: 'Tikamgarh', children: [] },
      { id: 'shahdol', name: 'Shahdol', children: [] },
      { id: 'anuppur', name: 'Anuppur', children: [] },
      { id: 'umaria', name: 'Umaria', children: [] },
      { id: 'ujjain', name: 'Ujjain', children: [] },
      { id: 'agar-malwa', name: 'Agar Malwa', children: [] },
      { id: 'dewas', name: 'Dewas', children: [] },
      { id: 'mandsaur', name: 'Mandsaur', children: [] },
      { id: 'neemuch', name: 'Neemuch', children: [] },
      { id: 'ratlam', name: 'Ratlam', children: [] },
      { id: 'shajapur', name: 'Shajapur', children: [] },
        ],
      },
      {
    id: 'maharashtra',
    name: 'Maharashtra',
        children: [
      { id: 'ahmednagar', name: 'Ahmednagar', children: [] },
      { id: 'akola', name: 'Akola', children: [] },
      { id: 'amravati', name: 'Amravati', children: [] },
      { id: 'aurangabad-mh', name: 'Aurangabad', children: [] },
      { id: 'beed', name: 'Beed', children: [] },
      { id: 'bhandara', name: 'Bhandara', children: [] },
      { id: 'buldhana', name: 'Buldhana', children: [] },
      { id: 'chandrapur', name: 'Chandrapur', children: [] },
      { id: 'dhule', name: 'Dhule', children: [] },
      { id: 'gadchiroli', name: 'Gadchiroli', children: [] },
      { id: 'gondia', name: 'Gondia', children: [] },
      { id: 'hingoli', name: 'Hingoli', children: [] },
      { id: 'jalgaon', name: 'Jalgaon', children: [] },
      { id: 'jalna', name: 'Jalna', children: [] },
      { id: 'kolhapur', name: 'Kolhapur', children: [] },
      { id: 'latur', name: 'Latur', children: [] },
      { id: 'mumbai-city', name: 'Mumbai City', children: [] },
      { id: 'mumbai-suburban', name: 'Mumbai Suburban', children: [] },
      { id: 'nagpur', name: 'Nagpur', children: [] },
      { id: 'nanded', name: 'Nanded', children: [] },
      { id: 'nandurbar', name: 'Nandurbar', children: [] },
      { id: 'nashik', name: 'Nashik', children: [] },
      { id: 'osmanabad', name: 'Osmanabad', children: [] },
      { id: 'palghar', name: 'Palghar', children: [] },
      { id: 'parbhani', name: 'Parbhani', children: [] },
      { id: 'pune', name: 'Pune', children: [] },
      { id: 'raigad', name: 'Raigad', children: [] },
      { id: 'ratnagiri', name: 'Ratnagiri', children: [] },
      { id: 'sangli', name: 'Sangli', children: [] },
      { id: 'satara', name: 'Satara', children: [] },
      { id: 'sindhudurg', name: 'Sindhudurg', children: [] },
      { id: 'solapur', name: 'Solapur', children: [] },
      { id: 'thane', name: 'Thane', children: [] },
      { id: 'wardha', name: 'Wardha', children: [] },
      { id: 'washim', name: 'Washim', children: [] },
      { id: 'yavatmal', name: 'Yavatmal', children: [] },
        ],
      },
      {
    id: 'manipur',
    name: 'Manipur',
        children: [
      { id: 'bishnupur', name: 'Bishnupur', children: [] },
      { id: 'chandel', name: 'Chandel', children: [] },
      { id: 'churachandpur', name: 'Churachandpur', children: [] },
      { id: 'imphal-east', name: 'Imphal East', children: [] },
      { id: 'imphal-west', name: 'Imphal West', children: [] },
      { id: 'jiribam', name: 'Jiribam', children: [] },
      { id: 'kakching', name: 'Kakching', children: [] },
      { id: 'kamjong', name: 'Kamjong', children: [] },
      { id: 'kangpokpi', name: 'Kangpokpi', children: [] },
      { id: 'noney', name: 'Noney', children: [] },
      { id: 'pherzawl', name: 'Pherzawl', children: [] },
      { id: 'senapati', name: 'Senapati', children: [] },
      { id: 'tamenglong', name: 'Tamenglong', children: [] },
      { id: 'tengnoupal', name: 'Tengnoupal', children: [] },
      { id: 'thoubal', name: 'Thoubal', children: [] },
      { id: 'ukhrul', name: 'Ukhrul', children: [] },
    ],
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    children: [
      { id: 'north-garo-hills', name: 'North Garo Hills', children: [] },
      { id: 'east-garo-hills', name: 'East Garo Hills', children: [] },
      { id: 'south-garo-hills', name: 'South Garo Hills', children: [] },
      { id: 'west-garo-hills', name: 'West Garo Hills', children: [] },
      { id: 'south-west-garo-hills', name: 'South West Garo Hills', children: [] },
      { id: 'west-jaintia-hills', name: 'West Jaintia Hills', children: [] },
      { id: 'east-jaintia-hills', name: 'East Jaintia Hills', children: [] },
      { id: 'east-khasi-hills', name: 'East Khasi Hills', children: [] },
      { id: 'west-khasi-hills', name: 'West Khasi Hills', children: [] },
      { id: 'south-west-khasi-hills', name: 'South West Khasi Hills', children: [] },
      { id: 'eastern-west-khasi-hills', name: 'Eastern West Khasi Hills', children: [] },
      { id: 'ri-bhoi', name: 'Ri-Bhoi', children: [] },
    ],
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    children: [
      { id: 'aizawl', name: 'Aizawl', children: [] },
      { id: 'champhai', name: 'Champhai', children: [] },
      { id: 'hnahthial', name: 'Hnahthial', children: [] },
      { id: 'khawzawl', name: 'Khawzawl', children: [] },
      { id: 'kolasib', name: 'Kolasib', children: [] },
      { id: 'lawngtlai', name: 'Lawngtlai', children: [] },
      { id: 'lunglei', name: 'Lunglei', children: [] },
      { id: 'mamit', name: 'Mamit', children: [] },
      { id: 'saiha', name: 'Saiha', children: [] },
      { id: 'saitual', name: 'Saitual', children: [] },
      { id: 'serchhip', name: 'Serchhip', children: [] },
    ],
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
        children: [
      { id: 'chumoukedima', name: 'Chümoukedima', children: [] },
      { id: 'dimapur', name: 'Dimapur', children: [] },
      { id: 'kiphire', name: 'Kiphire', children: [] },
      { id: 'kohima', name: 'Kohima', children: [] },
      { id: 'longleng', name: 'Longleng', children: [] },
      { id: 'meluri', name: 'Meluri', children: [] },
      { id: 'mokokchung', name: 'Mokokchung', children: [] },
      { id: 'mon', name: 'Mon', children: [] },
      { id: 'niuland', name: 'Niuland', children: [] },
      { id: 'noklak', name: 'Noklak', children: [] },
      { id: 'peren', name: 'Peren', children: [] },
      { id: 'phek', name: 'Phek', children: [] },
      { id: 'shamator', name: 'Shamator', children: [] },
      { id: 'tuensang', name: 'Tuensang', children: [] },
      { id: 'tseminyu', name: 'Tseminyü', children: [] },
      { id: 'wokha', name: 'Wokha', children: [] },
      { id: 'zunheboto', name: 'Zünheboto', children: [] },
        ],
      },
      {
    id: 'odisha',
    name: 'Odisha',
        children: [
      { id: 'angul', name: 'Angul', children: [] },
      { id: 'balangir', name: 'Balangir', children: [] },
      { id: 'balasore', name: 'Balasore', children: [] },
      { id: 'bargarh', name: 'Bargarh', children: [] },
      { id: 'bhadrak', name: 'Bhadrak', children: [] },
      { id: 'boudh', name: 'Boudh', children: [] },
      { id: 'cuttack', name: 'Cuttack', children: [] },
      { id: 'debagarh', name: 'Debagarh', children: [] },
      { id: 'dhenkanal', name: 'Dhenkanal', children: [] },
      { id: 'gajapati', name: 'Gajapati', children: [] },
      { id: 'ganjam', name: 'Ganjam', children: [] },
      { id: 'jagatsinghapur', name: 'Jagatsinghapur', children: [] },
      { id: 'jajpur', name: 'Jajpur', children: [] },
      { id: 'jharsuguda', name: 'Jharsuguda', children: [] },
      { id: 'kalahandi', name: 'Kalahandi', children: [] },
      { id: 'kandhamal', name: 'Kandhamal', children: [] },
      { id: 'kendrapara', name: 'Kendrapara', children: [] },
      { id: 'kendujhar', name: 'Kendujhar', children: [] },
      { id: 'khordha', name: 'Khordha', children: [] },
      { id: 'koraput', name: 'Koraput', children: [] },
      { id: 'malkangiri', name: 'Malkangiri', children: [] },
      { id: 'mayurbhanj', name: 'Mayurbhanj', children: [] },
      { id: 'nabarangpur', name: 'Nabarangpur', children: [] },
      { id: 'nayagarh', name: 'Nayagarh', children: [] },
      { id: 'nuapada', name: 'Nuapada', children: [] },
      { id: 'puri', name: 'Puri', children: [] },
      { id: 'rayagada', name: 'Rayagada', children: [] },
      { id: 'sambalpur', name: 'Sambalpur', children: [] },
      { id: 'subarnapur', name: 'Subarnapur', children: [] },
      { id: 'sundargarh', name: 'Sundargarh', children: [] },
    ],
  },
  {
    id: 'punjab',
    name: 'Punjab',
    children: [
      { id: 'amritsar', name: 'Amritsar', children: [] },
      { id: 'barnala', name: 'Barnala', children: [] },
      { id: 'bathinda', name: 'Bathinda', children: [] },
      { id: 'faridkot', name: 'Faridkot', children: [] },
      { id: 'fatehgarh-sahib', name: 'Fatehgarh Sahib', children: [] },
      { id: 'firozpur', name: 'Firozpur', children: [] },
      { id: 'fazilka', name: 'Fazilka', children: [] },
      { id: 'gurdaspur', name: 'Gurdaspur', children: [] },
      { id: 'hoshiarpur', name: 'Hoshiarpur', children: [] },
      { id: 'jalandhar', name: 'Jalandhar', children: [] },
      { id: 'kapurthala', name: 'Kapurthala', children: [] },
      { id: 'ludhiana', name: 'Ludhiana', children: [] },
      { id: 'malerkotla', name: 'Malerkotla', children: [] },
      { id: 'mansa', name: 'Mansa', children: [] },
      { id: 'moga', name: 'Moga', children: [] },
      { id: 'sri-muktsar-sahib', name: 'Sri Muktsar Sahib', children: [] },
      { id: 'pathankot', name: 'Pathankot', children: [] },
      { id: 'patiala', name: 'Patiala', children: [] },
      { id: 'rupnagar', name: 'Rupnagar', children: [] },
      { id: 'sahibzada-ajit-singh-nagar', name: 'Sahibzada Ajit Singh Nagar', children: [] },
      { id: 'sangrur', name: 'Sangrur', children: [] },
      { id: 'shaheed-bhagat-singh-nagar', name: 'Shaheed Bhagat Singh Nagar', children: [] },
      { id: 'tarn-taran', name: 'Tarn Taran', children: [] },
    ],
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    children: [
      { id: 'ajmer', name: 'Ajmer', children: [] },
      { id: 'alwar', name: 'Alwar', children: [] },
      { id: 'balotra', name: 'Balotra', children: [] },
      { id: 'banswara', name: 'Banswara', children: [] },
      { id: 'baran', name: 'Baran', children: [] },
      { id: 'barmer', name: 'Barmer', children: [] },
      { id: 'beawar', name: 'Beawar', children: [] },
      { id: 'bharatpur', name: 'Bharatpur', children: [] },
      { id: 'bhilwara', name: 'Bhilwara', children: [] },
      { id: 'bikaner', name: 'Bikaner', children: [] },
      { id: 'bundi', name: 'Bundi', children: [] },
      { id: 'chittorgarh', name: 'Chittorgarh', children: [] },
      { id: 'churu', name: 'Churu', children: [] },
      { id: 'dausa', name: 'Dausa', children: [] },
      { id: 'deeg', name: 'Deeg', children: [] },
      { id: 'didwana-kuchaman', name: 'Didwana-Kuchaman', children: [] },
      { id: 'dholpur', name: 'Dholpur', children: [] },
      { id: 'dungarpur', name: 'Dungarpur', children: [] },
      { id: 'hanumangarh', name: 'Hanumangarh', children: [] },
      { id: 'jaipur', name: 'Jaipur', children: [] },
      { id: 'jaisalmer', name: 'Jaisalmer', children: [] },
      { id: 'jalore', name: 'Jalore', children: [] },
      { id: 'jhalawar', name: 'Jhalawar', children: [] },
      { id: 'jhunjhunu', name: 'Jhunjhunu', children: [] },
      { id: 'jodhpur', name: 'Jodhpur', children: [] },
      { id: 'karauli', name: 'Karauli', children: [] },
      { id: 'khairthal-tijara', name: 'Khairthal-Tijara', children: [] },
      { id: 'kota', name: 'Kota', children: [] },
      { id: 'kotputli-behror', name: 'Kotputli-Behror', children: [] },
      { id: 'nagaur', name: 'Nagaur', children: [] },
      { id: 'pali', name: 'Pali', children: [] },
      { id: 'phalodi', name: 'Phalodi', children: [] },
      { id: 'pratapgarh-raj', name: 'Pratapgarh', children: [] },
      { id: 'rajsamand', name: 'Rajsamand', children: [] },
      { id: 'salumbar', name: 'Salumbar', children: [] },
      { id: 'sawai-madhopur', name: 'Sawai Madhopur', children: [] },
      { id: 'sikar', name: 'Sikar', children: [] },
      { id: 'sirohi', name: 'Sirohi', children: [] },
      { id: 'sri-ganganagar', name: 'Sri Ganganagar', children: [] },
      { id: 'tonk', name: 'Tonk', children: [] },
      { id: 'udaipur', name: 'Udaipur', children: [] },
    ],
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
        children: [
      { id: 'gangtok', name: 'Gangtok', children: [] },
      { id: 'mangan', name: 'Mangan', children: [] },
      { id: 'pakyong', name: 'Pakyong', children: [] },
      { id: 'soreng', name: 'Soreng', children: [] },
      { id: 'namchi', name: 'Namchi', children: [] },
      { id: 'gyalshing', name: 'Gyalshing', children: [] },
        ],
      },
      {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
        children: [
      { id: 'ariyalur', name: 'Ariyalur', children: [] },
      { id: 'chengalpattu', name: 'Chengalpattu', children: [] },
      { id: 'chennai', name: 'Chennai', children: [] },
      { id: 'coimbatore', name: 'Coimbatore', children: [] },
      { id: 'cuddalore', name: 'Cuddalore', children: [] },
      { id: 'dharmapuri', name: 'Dharmapuri', children: [] },
      { id: 'dindigul', name: 'Dindigul', children: [] },
      { id: 'erode', name: 'Erode', children: [] },
      { id: 'kallakurichi', name: 'Kallakurichi', children: [] },
      { id: 'kancheepuram', name: 'Kancheepuram', children: [] },
      { id: 'kanniyakumari', name: 'Kanniyakumari', children: [] },
      { id: 'karur', name: 'Karur', children: [] },
      { id: 'krishnagiri', name: 'Krishnagiri', children: [] },
      { id: 'madurai', name: 'Madurai', children: [] },
      { id: 'mayiladuthurai', name: 'Mayiladuthurai', children: [] },
      { id: 'nagapattinam', name: 'Nagapattinam', children: [] },
      { id: 'namakkal', name: 'Namakkal', children: [] },
      { id: 'nilgiris', name: 'Nilgiris', children: [] },
      { id: 'perambalur', name: 'Perambalur', children: [] },
      { id: 'pudukottai', name: 'Pudukkottai', children: [] },
      { id: 'ramanathapuram', name: 'Ramanathapuram', children: [] },
      { id: 'ranipet', name: 'Ranipet', children: [] },
      { id: 'salem', name: 'Salem', children: [] },
      { id: 'sivaganga', name: 'Sivaganga', children: [] },
      { id: 'tenkasi', name: 'Tenkasi', children: [] },
      { id: 'thanjavur', name: 'Thanjavur', children: [] },
      { id: 'theni', name: 'Theni', children: [] },
      { id: 'thiruchirappalli', name: 'Tiruchirappalli', children: [] },
      { id: 'thirunelveli', name: 'Tirunelveli', children: [] },
      { id: 'thirupathur', name: 'Tirupathur', children: [] },
      { id: 'thiruvarur', name: 'Tiruvarur', children: [] },
      { id: 'thoothukudi', name: 'Thoothukudi', children: [] },
      { id: 'tiruppur', name: 'Tiruppur', children: [] },
      { id: 'tiruvallur', name: 'Tiruvallur', children: [] },
      { id: 'tiruvannamalai', name: 'Tiruvannamalai', children: [] },
      { id: 'vellore', name: 'Vellore', children: [] },
      { id: 'viluppuram', name: 'Viluppuram', children: [] },
      { id: 'virudhunagar', name: 'Virudhunagar', children: [] },
    ],
  },
  {
    id: 'telangana',
    name: 'Telangana',
    children: [
      { id: 'adilabad', name: 'Adilabad', children: [] },
      { id: 'kumuram-bheem-asifabad', name: 'Kumuram Bheem Asifabad', children: [] },
      { id: 'mancherial', name: 'Mancherial', children: [] },
      { id: 'nirmal', name: 'Nirmal', children: [] },
      { id: 'nizamabad', name: 'Nizamabad', children: [] },
      { id: 'jagtial', name: 'Jagtial', children: [] },
      { id: 'peddapalli', name: 'Peddapalli', children: [] },
      { id: 'kamareddy', name: 'Kamareddy', children: [] },
      { id: 'rajanna-sircilla', name: 'Rajanna Sircilla', children: [] },
      { id: 'karimnagar', name: 'Karimnagar', children: [] },
      { id: 'jayashankar-bhupalpally', name: 'Jayashankar Bhupalpally', children: [] },
      { id: 'sangareddy', name: 'Sangareddy', children: [] },
      { id: 'medak', name: 'Medak', children: [] },
      { id: 'siddipet', name: 'Siddipet', children: [] },
      { id: 'jangaon', name: 'Jangaon', children: [] },
      { id: 'hanumakonda', name: 'Hanumakonda', children: [] },
      { id: 'warangal', name: 'Warangal', children: [] },
      { id: 'mulugu', name: 'Mulugu', children: [] },
      { id: 'bhadradri-kothagudem', name: 'Bhadradri Kothagudem', children: [] },
      { id: 'khammam', name: 'Khammam', children: [] },
      { id: 'mahabubabad', name: 'Mahabubabad', children: [] },
      { id: 'suryapet', name: 'Suryapet', children: [] },
      { id: 'nalgonda', name: 'Nalgonda', children: [] },
      { id: 'yadadri-bhuvanagiri', name: 'Yadadri Bhuvanagiri', children: [] },
      { id: 'medchal-malkajgiri', name: 'Medchal–Malkajgiri', children: [] },
      { id: 'hyderabad', name: 'Hyderabad', children: [] },
      { id: 'ranga-reddy', name: 'Ranga Reddy', children: [] },
      { id: 'vikarabad', name: 'Vikarabad', children: [] },
      { id: 'narayanpet', name: 'Narayanpet', children: [] },
      { id: 'mahabubnagar', name: 'Mahabubnagar', children: [] },
      { id: 'nagarkurnool', name: 'Nagarkurnool', children: [] },
      { id: 'wanaparthy', name: 'Wanaparthy', children: [] },
      { id: 'jogulamba-gadwal', name: 'Jogulamba Gadwal', children: [] },
    ],
  },
  {
    id: 'tripura',
    name: 'Tripura',
    children: [
      { id: 'dhalai', name: 'Dhalai', children: [] },
      { id: 'gomati', name: 'Gomati', children: [] },
      { id: 'khowai', name: 'Khowai', children: [] },
      { id: 'sipahijala', name: 'Sipahijala', children: [] },
      { id: 'unakoti', name: 'Unakoti', children: [] },
      { id: 'north-tripura', name: 'North Tripura', children: [] },
      { id: 'south-tripura', name: 'South Tripura', children: [] },
      { id: 'west-tripura', name: 'West Tripura', children: [] },
    ],
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    children: [
      { id: 'agra', name: 'Agra', children: [] },
      { id: 'aligarh', name: 'Aligarh', children: [] },
      { id: 'ambedkar-nagar', name: 'Ambedkar Nagar', children: [] },
      { id: 'amethi-up', name: 'Amethi', children: [] },
      { id: 'amroha', name: 'Amroha', children: [] },
      { id: 'auraiya', name: 'Auraiya', children: [] },
      { id: 'ayodhya', name: 'Ayodhya', children: [] },
      { id: 'azamgarh', name: 'Azamgarh', children: [] },
      { id: 'budaun', name: 'Budaun', children: [] },
      { id: 'bagpat', name: 'Bagpat', children: [] },
      { id: 'bahraich', name: 'Bahraich', children: [] },
      { id: 'ballia', name: 'Ballia', children: [] },
      { id: 'balrampur-up', name: 'Balrampur', children: [] },
      { id: 'banda', name: 'Banda', children: [] },
      { id: 'barabanki', name: 'Barabanki', children: [] },
      { id: 'bareilly', name: 'Bareilly', children: [] },
      { id: 'basti', name: 'Basti', children: [] },
      { id: 'bhadohi', name: 'Bhadohi', children: [] },
      { id: 'bijnor', name: 'Bijnor', children: [] },
      { id: 'bulandshahr', name: 'Bulandshahr', children: [] },
      { id: 'chandauli', name: 'Chandauli', children: [] },
      { id: 'chitrakoot', name: 'Chitrakoot', children: [] },
      { id: 'deoria', name: 'Deoria', children: [] },
      { id: 'etah', name: 'Etah', children: [] },
      { id: 'etawah', name: 'Etawah', children: [] },
      { id: 'farrukhabad', name: 'Farrukhabad', children: [] },
      { id: 'fatehpur', name: 'Fatehpur', children: [] },
      { id: 'firozabad', name: 'Firozabad', children: [] },
      { id: 'gautam-buddha-nagar', name: 'Gautam Buddha Nagar', children: [] },
      { id: 'ghaziabad', name: 'Ghaziabad', children: [] },
      { id: 'ghazipur', name: 'Ghazipur', children: [] },
      { id: 'gonda', name: 'Gonda', children: [] },
      { id: 'gorakhpur', name: 'Gorakhpur', children: [] },
      { id: 'hamirpur-up', name: 'Hamirpur', children: [] },
      { id: 'hapur', name: 'Hapur', children: [] },
      { id: 'hardoi', name: 'Hardoi', children: [] },
      { id: 'hathras', name: 'Hathras', children: [] },
      { id: 'jalaun', name: 'Jalaun', children: [] },
      { id: 'jaunpur', name: 'Jaunpur', children: [] },
      { id: 'jhansi', name: 'Jhansi', children: [] },
      { id: 'kannauj', name: 'Kannauj', children: [] },
      { id: 'kanpur-dehat', name: 'Kanpur Dehat', children: [] },
      { id: 'kanpur-nagar', name: 'Kanpur Nagar', children: [] },
      { id: 'kasganj', name: 'Kasganj', children: [] },
      { id: 'kaushambi', name: 'Kaushambi', children: [] },
      { id: 'kushinagar', name: 'Kushinagar', children: [] },
      { id: 'lakhimpur-kheri', name: 'Lakhimpur Kheri', children: [] },
      { id: 'lalitpur', name: 'Lalitpur', children: [] },
      { id: 'lucknow', name: 'Lucknow', children: [] },
      { id: 'maharajganj', name: 'Maharajganj', children: [] },
      { id: 'mahoba', name: 'Mahoba', children: [] },
      { id: 'mainpuri', name: 'Mainpuri', children: [] },
      { id: 'mathura', name: 'Mathura', children: [] },
      { id: 'mau', name: 'Mau', children: [] },
      { id: 'meerut', name: 'Meerut', children: [] },
      { id: 'mirzapur', name: 'Mirzapur', children: [] },
      { id: 'moradabad', name: 'Moradabad', children: [] },
      { id: 'muzaffarnagar', name: 'Muzaffarnagar', children: [] },
      { id: 'pilibhit', name: 'Pilibhit', children: [] },
      { id: 'pratapgarh-up', name: 'Pratapgarh', children: [] },
      { id: 'prayagraj', name: 'Prayagraj', children: [] },
      { id: 'rae-bareli', name: 'Rae Bareli', children: [] },
      { id: 'rampur', name: 'Rampur', children: [] },
      { id: 'saharanpur', name: 'Saharanpur', children: [] },
      { id: 'sant-kabir-nagar', name: 'Sant Kabir Nagar', children: [] },
      { id: 'sambhal', name: 'Sambhal', children: [] },
      { id: 'shahjahanpur', name: 'Shahjahanpur', children: [] },
      { id: 'shamli', name: 'Shamli', children: [] },
      { id: 'shravasti', name: 'Shravasti', children: [] },
      { id: 'siddharthnagar', name: 'Siddharthnagar', children: [] },
      { id: 'sitapur', name: 'Sitapur', children: [] },
      { id: 'sonbhadra', name: 'Sonbhadra', children: [] },
      { id: 'sultanpur', name: 'Sultanpur', children: [] },
      { id: 'unnao', name: 'Unnao', children: [] },
      { id: 'varanasi', name: 'Varanasi', children: [] },
    ],
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    children: [
      { id: 'almora', name: 'Almora', children: [] },
      { id: 'bageshwar', name: 'Bageshwar', children: [] },
      { id: 'chamoli', name: 'Chamoli', children: [] },
      { id: 'champawat', name: 'Champawat', children: [] },
      { id: 'dehradun', name: 'Dehradun', children: [] },
      { id: 'haridwar', name: 'Haridwar', children: [] },
      { id: 'nainital', name: 'Nainital', children: [] },
      { id: 'pauri-garhwal', name: 'Pauri Garhwal', children: [] },
      { id: 'pithoragarh', name: 'Pithoragarh', children: [] },
      { id: 'rudraprayag', name: 'Rudraprayag', children: [] },
      { id: 'tehri-garhwal', name: 'Tehri Garhwal', children: [] },
      { id: 'udham-singh-nagar', name: 'Udham Singh Nagar', children: [] },
      { id: 'uttarkashi', name: 'Uttarkashi', children: [] },
    ],
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    children: [
      { id: 'alipurduar', name: 'Alipurduar', children: [] },
      { id: 'bankura', name: 'Bankura', children: [] },
      { id: 'paschim-bardhaman', name: 'Paschim Bardhaman', children: [] },
      { id: 'purba-bardhaman', name: 'Purba Bardhaman', children: [] },
      { id: 'birbhum', name: 'Birbhum', children: [] },
      { id: 'cooch-behar', name: 'Cooch Behar', children: [] },
      { id: 'darjeeling', name: 'Darjeeling', children: [] },
      { id: 'dakshin-dinajpur', name: 'Dakshin Dinajpur', children: [] },
      { id: 'hooghly', name: 'Hooghly', children: [] },
      { id: 'howrah', name: 'Howrah', children: [] },
      { id: 'jalpaiguri', name: 'Jalpaiguri', children: [] },
      { id: 'jhargram', name: 'Jhargram', children: [] },
      { id: 'kolkata', name: 'Kolkata', children: [] },
      { id: 'kalimpong', name: 'Kalimpong', children: [] },
      { id: 'malda', name: 'Malda', children: [] },
      { id: 'paschim-medinipur', name: 'Paschim Medinipur', children: [] },
      { id: 'purba-medinipur', name: 'Purba Medinipur', children: [] },
      { id: 'murshidabad', name: 'Murshidabad', children: [] },
      { id: 'nadia', name: 'Nadia', children: [] },
      { id: 'north-24-parganas', name: 'North 24 Parganas', children: [] },
      { id: 'purulia', name: 'Purulia', children: [] },
      { id: 'south-24-parganas', name: 'South 24 Parganas', children: [] },
      { id: 'uttar-dinajpur', name: 'Uttar Dinajpur', children: [] },
    ],
  },
  // Union territories
  {
    id: 'andaman-nicobar',
    name: 'Andaman and Nicobar Islands',
    children: [
      { id: 'nicobar', name: 'Nicobar', children: [] },
      { id: 'north-and-middle-andaman', name: 'North and Middle Andaman', children: [] },
      { id: 'south-andaman', name: 'South Andaman', children: [] },
    ],
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    children: [
      { id: 'chandigarh-district', name: 'Chandigarh', children: [] },
    ],
  },
  {
    id: 'dadra-nagar-haveli-daman-diu',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    children: [
      { id: 'dadra-and-nagar-haveli', name: 'Dadra and Nagar Haveli', children: [] },
      { id: 'daman', name: 'Daman', children: [] },
      { id: 'diu', name: 'Diu', children: [] },
    ],
  },
  {
    id: 'delhi',
    name: 'Delhi',
    children: [
      { id: 'central-delhi', name: 'Central Delhi', children: [] },
      { id: 'east-delhi', name: 'East Delhi', children: [] },
      { id: 'new-delhi', name: 'New Delhi', children: [] },
      { id: 'north-delhi', name: 'North Delhi', children: [] },
      { id: 'north-east-delhi', name: 'North East Delhi', children: [] },
      { id: 'north-west-delhi', name: 'North West Delhi', children: [] },
      { id: 'shahdara', name: 'Shahdara', children: [] },
      { id: 'south-delhi', name: 'South Delhi', children: [] },
      { id: 'south-east-delhi', name: 'South East Delhi', children: [] },
      { id: 'south-west-delhi', name: 'South West Delhi', children: [] },
      { id: 'west-delhi', name: 'West Delhi', children: [] },
    ],
  },
  {
    id: 'jammu-kashmir',
    name: 'Jammu and Kashmir',
    children: [
      { id: 'anantnag', name: 'Anantnag', children: [] },
      { id: 'bandipora', name: 'Bandipora', children: [] },
      { id: 'baramulla', name: 'Baramulla', children: [] },
      { id: 'budgam', name: 'Budgam', children: [] },
      { id: 'doda', name: 'Doda', children: [] },
      { id: 'ganderbal', name: 'Ganderbal', children: [] },
      { id: 'jammu', name: 'Jammu', children: [] },
      { id: 'kathua', name: 'Kathua', children: [] },
      { id: 'kishtwar', name: 'Kishtwar', children: [] },
      { id: 'kulgam', name: 'Kulgam', children: [] },
      { id: 'kupwara', name: 'Kupwara', children: [] },
      { id: 'poonch', name: 'Poonch', children: [] },
      { id: 'pulwama', name: 'Pulwama', children: [] },
      { id: 'rajouri', name: 'Rajouri', children: [] },
      { id: 'ramban', name: 'Ramban', children: [] },
      { id: 'reasi', name: 'Reasi', children: [] },
      { id: 'samba', name: 'Samba', children: [] },
      { id: 'shopian', name: 'Shopian', children: [] },
      { id: 'srinagar', name: 'Srinagar', children: [] },
      { id: 'udhampur', name: 'Udhampur', children: [] },
    ],
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    children: [
      { id: 'leh', name: 'Leh', children: [] },
      { id: 'kargil', name: 'Kargil', children: [] },
    ],
  },
  {
    id: 'lakshadweep',
    name: 'Lakshadweep',
    children: [
      { id: 'lakshadweep-district', name: 'Lakshadweep', children: [] },
    ],
  },
  {
    id: 'puducherry',
    name: 'Puducherry',
    children: [
      { id: 'puducherry-district', name: 'Puducherry', children: [] },
      { id: 'karaikal', name: 'Karaikal', children: [] },
      { id: 'mahe', name: 'Mahe', children: [] },
      { id: 'yanam', name: 'Yanam', children: [] },
    ],
  },
]

// ---------- Property Types ----------
export const propertyTypes = ['Resort', 'Hotel', 'Homestay', 'Business Class Hotel', 'Lodging', 'Cottage'] as const
export const propertyClasses = ['Luxury', 'Premium', 'Standard', 'Average'] as const
export const roomCategories = ['1-10 rooms', '11-20 rooms', '21-30 rooms', '30+ rooms'] as const
export const tenureOptions = ['6 Months', '1 Year'] as const
export const primaryContactOptions = ['HR', 'Front Office', 'Manager', 'Owner'] as const
export const visitStatusOptions = ['Closed', 'Interested', 'Not Interested', 'Rescheduled'] as const

export interface Property {
  id: string
  slno: number
  name: string
  propertyType: typeof propertyTypes[number]
  propertyClass: typeof propertyClasses[number]
  roomCategory: typeof roomCategories[number]
  numberOfRooms: number
  hasMultipleProperty: boolean
  email: string
  proposedPrice: number
  finalCommittedPrice: number
  tenure: typeof tenureOptions[number]
  place: string
  primaryContactPerson: typeof primaryContactOptions[number]
  contactPersonName: string
  contactNumber: string
  firstVisitDate: string
  firstVisitStatus: string
  comments: string
  rescheduledDate?: string
  rescheduledComment?: string
  secondVisitExecutive?: string
  secondVisitDate?: string
  secondVisitStatus?: typeof visitStatusOptions[number]
  closingAmount?: number
  planStartDate: string
  planExpiryDate: string
  locationLink: string
  currentPMS: string
  connectedOTAPlatforms: string[]
  state: string
  district: string
  location: string
  // audit fields (optional, can be filled from backend later)
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
}

export const properties: Property[] = [
  {
    id: 'p1',
    slno: 1,
    name: 'Ocean Breeze Resort',
    propertyType: 'Resort',
    propertyClass: 'Luxury',
    roomCategory: '30+ rooms',
    numberOfRooms: 45,
    hasMultipleProperty: true,
    email: 'info@oceanbreeze.com',
    proposedPrice: 150000,
    finalCommittedPrice: 135000,
    tenure: '1 Year',
    place: 'Calicut Beach',
    primaryContactPerson: 'Manager',
    contactPersonName: 'Rajesh Kumar',
    contactNumber: '+91 98765 43210',
    firstVisitDate: '2025-12-15',
    firstVisitStatus: 'Completed',
    comments: 'Very interested in premium plan with OTA integration.',
    secondVisitExecutive: 'Anil Menon',
    secondVisitDate: '2025-12-22',
    secondVisitStatus: 'Closed',
    closingAmount: 135000,
    planStartDate: '2026-01-01',
    planExpiryDate: '2026-12-31',
    locationLink: 'https://maps.google.com/?q=11.2588,75.7804',
    currentPMS: 'None',
    connectedOTAPlatforms: ['Booking.com', 'MakeMyTrip', 'Goibibo'],
    state: 'Kerala',
    district: 'Kozhikode',
    location: 'Calicut Beach',
  },
  {
    id: 'p2',
    slno: 2,
    name: 'Kappad Heritage Inn',
    propertyType: 'Hotel',
    propertyClass: 'Premium',
    roomCategory: '11-20 rooms',
    numberOfRooms: 18,
    hasMultipleProperty: false,
    email: 'book@kappadinn.in',
    proposedPrice: 85000,
    finalCommittedPrice: 78000,
    tenure: '1 Year',
    place: 'Kappad',
    primaryContactPerson: 'Owner',
    contactPersonName: 'Priya Nair',
    contactNumber: '+91 87654 32109',
    firstVisitDate: '2025-11-20',
    firstVisitStatus: 'Completed',
    comments: 'Wants channel manager integration.',
    secondVisitExecutive: 'Deepa S',
    secondVisitDate: '2025-12-05',
    secondVisitStatus: 'Closed',
    closingAmount: 78000,
    planStartDate: '2026-01-10',
    planExpiryDate: '2027-01-09',
    locationLink: 'https://maps.google.com/?q=11.3850,75.7217',
    currentPMS: 'eZee',
    connectedOTAPlatforms: ['OYO', 'Agoda'],
    state: 'Kerala',
    district: 'Kozhikode',
    location: 'Kappad',
  },
  {
    id: 'p3',
    slno: 3,
    name: 'Beypore Cottage Stay',
    propertyType: 'Cottage',
    propertyClass: 'Standard',
    roomCategory: '1-10 rooms',
    numberOfRooms: 6,
    hasMultipleProperty: false,
    email: 'stay@beyporecottage.com',
    proposedPrice: 35000,
    finalCommittedPrice: 30000,
    tenure: '6 Months',
    place: 'Beypore',
    primaryContactPerson: 'Owner',
    contactPersonName: 'Suresh Babu',
    contactNumber: '+91 76543 21098',
    firstVisitDate: '2026-01-10',
    firstVisitStatus: 'Completed',
    comments: 'Small property but interested in trial.',
    secondVisitStatus: 'Interested',
    planStartDate: '2026-02-01',
    planExpiryDate: '2026-07-31',
    locationLink: 'https://maps.google.com/?q=11.1700,75.8045',
    currentPMS: 'Manual',
    connectedOTAPlatforms: [],
    state: 'Kerala',
    district: 'Kozhikode',
    location: 'Beypore',
  },
  {
    id: 'p4',
    slno: 4,
    name: 'Fort Kochi Grand Hotel',
    propertyType: 'Business Class Hotel',
    propertyClass: 'Luxury',
    roomCategory: '30+ rooms',
    numberOfRooms: 72,
    hasMultipleProperty: true,
    email: 'reservations@fkgrand.com',
    proposedPrice: 250000,
    finalCommittedPrice: 220000,
    tenure: '1 Year',
    place: 'Fort Kochi',
    primaryContactPerson: 'Manager',
    contactPersonName: 'Anitha George',
    contactNumber: '+91 90123 45678',
    firstVisitDate: '2025-10-05',
    firstVisitStatus: 'Completed',
    comments: 'Enterprise client, wants custom dashboard.',
    secondVisitExecutive: 'Anil Menon',
    secondVisitDate: '2025-10-20',
    secondVisitStatus: 'Closed',
    closingAmount: 220000,
    planStartDate: '2025-11-01',
    planExpiryDate: '2026-10-31',
    locationLink: 'https://maps.google.com/?q=9.9658,76.2421',
    currentPMS: 'Hotelogix',
    connectedOTAPlatforms: ['Booking.com', 'Expedia', 'MakeMyTrip', 'Airbnb'],
    state: 'Kerala',
    district: 'Ernakulam',
    location: 'Fort Kochi',
  },
  {
    id: 'p5',
    slno: 5,
    name: 'Marine Drive Suites',
    propertyType: 'Hotel',
    propertyClass: 'Premium',
    roomCategory: '21-30 rooms',
    numberOfRooms: 28,
    hasMultipleProperty: false,
    email: 'info@marinedrivesuites.com',
    proposedPrice: 120000,
    finalCommittedPrice: 0,
    tenure: '1 Year',
    place: 'Marine Drive',
    primaryContactPerson: 'Front Office',
    contactPersonName: 'Meera Krishnan',
    contactNumber: '+91 88776 65544',
    firstVisitDate: '2026-02-14',
    firstVisitStatus: 'Completed',
    comments: 'Interested but evaluating competitors.',
    secondVisitStatus: 'Interested',
    planStartDate: '',
    planExpiryDate: '',
    locationLink: 'https://maps.google.com/?q=9.9816,76.2752',
    currentPMS: 'IDS Next',
    connectedOTAPlatforms: ['Booking.com', 'Goibibo'],
    state: 'Kerala',
    district: 'Ernakulam',
    location: 'Marine Drive',
  },
  {
    id: 'p6',
    slno: 6,
    name: 'Kovalam Beach Resort',
    propertyType: 'Resort',
    propertyClass: 'Luxury',
    roomCategory: '30+ rooms',
    numberOfRooms: 55,
    hasMultipleProperty: true,
    email: 'bookings@kovalamresort.com',
    proposedPrice: 200000,
    finalCommittedPrice: 185000,
    tenure: '1 Year',
    place: 'Kovalam',
    primaryContactPerson: 'Manager',
    contactPersonName: 'Dr. Vineeth R',
    contactNumber: '+91 94123 67890',
    firstVisitDate: '2025-09-12',
    firstVisitStatus: 'Completed',
    comments: 'Closing expected soon. High-value client.',
    secondVisitExecutive: 'Deepa S',
    secondVisitDate: '2025-09-25',
    secondVisitStatus: 'Closed',
    closingAmount: 185000,
    planStartDate: '2025-10-01',
    planExpiryDate: '2026-03-20',
    locationLink: 'https://maps.google.com/?q=8.4000,76.9780',
    currentPMS: 'Opera',
    connectedOTAPlatforms: ['Booking.com', 'Expedia', 'Agoda', 'TripAdvisor'],
    state: 'Kerala',
    district: 'Trivandrum',
    location: 'Kovalam',
  },
  {
    id: 'p7',
    slno: 7,
    name: 'Baga Beachfront Hotel',
    propertyType: 'Hotel',
    propertyClass: 'Premium',
    roomCategory: '21-30 rooms',
    numberOfRooms: 25,
    hasMultipleProperty: false,
    email: 'info@bagabeachfront.com',
    proposedPrice: 110000,
    finalCommittedPrice: 95000,
    tenure: '1 Year',
    place: 'Baga',
    primaryContactPerson: 'Owner',
    contactPersonName: 'Rahul D\'Souza',
    contactNumber: '+91 83214 56789',
    firstVisitDate: '2026-01-20',
    firstVisitStatus: 'Completed',
    comments: 'Goa market entry. Very positive feedback.',
    secondVisitExecutive: 'Anil Menon',
    secondVisitDate: '2026-02-05',
    secondVisitStatus: 'Closed',
    closingAmount: 95000,
    planStartDate: '2026-02-15',
    planExpiryDate: '2027-02-14',
    locationLink: 'https://maps.google.com/?q=15.5558,73.7514',
    currentPMS: 'None',
    connectedOTAPlatforms: ['Booking.com', 'MakeMyTrip'],
    state: 'Goa',
    district: 'North Goa',
    location: 'Baga',
  },
  {
    id: 'p8',
    slno: 8,
    name: 'Whitefield Business Lodging',
    propertyType: 'Lodging',
    propertyClass: 'Standard',
    roomCategory: '11-20 rooms',
    numberOfRooms: 16,
    hasMultipleProperty: false,
    email: 'book@wflodging.in',
    proposedPrice: 55000,
    finalCommittedPrice: 0,
    tenure: '6 Months',
    place: 'Whitefield',
    primaryContactPerson: 'HR',
    contactPersonName: 'Kavitha M',
    contactNumber: '+91 72345 98761',
    firstVisitDate: '2026-03-01',
    firstVisitStatus: 'Completed',
    comments: 'Budget constraints. Follow up in April.',
    rescheduledDate: '2026-04-10',
    rescheduledComment: 'Client requested follow-up after quarterly budget review.',
    secondVisitStatus: 'Rescheduled',
    planStartDate: '',
    planExpiryDate: '',
    locationLink: 'https://maps.google.com/?q=12.9698,77.7500',
    currentPMS: 'None',
    connectedOTAPlatforms: [],
    state: 'Karnataka',
    district: 'Bangalore',
    location: 'Whitefield',
  },
]

// ---------- Dashboard Stats ----------
export const dashboardStats = {
  totalProperties: 248,
  totalRevenue: 12450000,
  pendingPayments: 3200000,
  activeTravelAgents: 87,
  salesClosingsThisMonth: 14,
  upcomingPlanExpiry: 6,
}

// ---------- Revenue Chart Data ----------
export const revenueChartData = [
  { month: 'Apr', revenue: 850000, target: 900000 },
  { month: 'May', revenue: 920000, target: 900000 },
  { month: 'Jun', revenue: 780000, target: 950000 },
  { month: 'Jul', revenue: 1050000, target: 1000000 },
  { month: 'Aug', revenue: 1120000, target: 1000000 },
  { month: 'Sep', revenue: 980000, target: 1050000 },
  { month: 'Oct', revenue: 1250000, target: 1100000 },
  { month: 'Nov', revenue: 1180000, target: 1100000 },
  { month: 'Dec', revenue: 1350000, target: 1200000 },
  { month: 'Jan', revenue: 1420000, target: 1200000 },
  { month: 'Feb', revenue: 1080000, target: 1250000 },
  { month: 'Mar', revenue: 1470000, target: 1300000 },
]

export const salesPerformanceData = [
  { name: 'Anil Menon', closings: 28, demos: 45, trials: 18, revenue: 3250000 },
  { name: 'Deepa S', closings: 22, demos: 38, trials: 15, revenue: 2870000 },
  { name: 'Rajan K', closings: 19, demos: 32, trials: 12, revenue: 2150000 },
  { name: 'Meera Nair', closings: 15, demos: 28, trials: 10, revenue: 1780000 },
  { name: 'Vishal P', closings: 12, demos: 22, trials: 8, revenue: 1400000 },
]

export const propertyDistributionData = [
  { name: 'Resort', value: 48, color: '#6366f1' },
  { name: 'Hotel', value: 85, color: '#818cf8' },
  { name: 'Homestay', value: 42, color: '#a5b4fc' },
  { name: 'Business Class', value: 35, color: '#10b981' },
  { name: 'Lodging', value: 22, color: '#34d399' },
  { name: 'Cottage', value: 16, color: '#6ee7b7' },
]

export const closingVsPendingData = [
  { month: 'Oct', closed: 12, pending: 5 },
  { month: 'Nov', closed: 15, pending: 8 },
  { month: 'Dec', closed: 18, pending: 6 },
  { month: 'Jan', closed: 22, pending: 9 },
  { month: 'Feb', closed: 14, pending: 7 },
  { month: 'Mar', closed: 20, pending: 4 },
]

// ---------- Finance ----------
export interface FinanceRecord {
  id: string
  propertyName: string
  state: string
  district: string
  location: string
  closingAmount: number
  pendingAmount: number
  collectedAmount: number
  invoiceUploaded: boolean
  invoiceDate?: string
  lastPaymentDate?: string
}

export const financeRecords: FinanceRecord[] = [
  { id: 'f1', propertyName: 'Ocean Breeze Resort', state: 'Kerala', district: 'Kozhikode', location: 'Calicut Beach', closingAmount: 135000, pendingAmount: 0, collectedAmount: 135000, invoiceUploaded: true, invoiceDate: '2026-01-05', lastPaymentDate: '2026-01-10' },
  { id: 'f2', propertyName: 'Kappad Heritage Inn', state: 'Kerala', district: 'Kozhikode', location: 'Kappad', closingAmount: 78000, pendingAmount: 28000, collectedAmount: 50000, invoiceUploaded: true, invoiceDate: '2026-01-15', lastPaymentDate: '2026-02-01' },
  { id: 'f3', propertyName: 'Fort Kochi Grand Hotel', state: 'Kerala', district: 'Ernakulam', location: 'Fort Kochi', closingAmount: 220000, pendingAmount: 70000, collectedAmount: 150000, invoiceUploaded: true, invoiceDate: '2025-11-10', lastPaymentDate: '2026-01-15' },
  { id: 'f4', propertyName: 'Kovalam Beach Resort', state: 'Kerala', district: 'Trivandrum', location: 'Kovalam', closingAmount: 185000, pendingAmount: 85000, collectedAmount: 100000, invoiceUploaded: false },
  { id: 'f5', propertyName: 'Baga Beachfront Hotel', state: 'Goa', district: 'North Goa', location: 'Baga', closingAmount: 95000, pendingAmount: 95000, collectedAmount: 0, invoiceUploaded: false },
  { id: 'f6', propertyName: 'Beypore Cottage Stay', state: 'Kerala', district: 'Kozhikode', location: 'Beypore', closingAmount: 30000, pendingAmount: 15000, collectedAmount: 15000, invoiceUploaded: true, invoiceDate: '2026-02-10', lastPaymentDate: '2026-02-20' },
]

export const financeStats = {
  totalClosingAmount: 743000,
  pendingAmount: 293000,
  collectedAmount: 450000,
}

export const dailyRevenueData = [
  { day: 'Mon', revenue: 45000 },
  { day: 'Tue', revenue: 52000 },
  { day: 'Wed', revenue: 38000 },
  { day: 'Thu', revenue: 65000 },
  { day: 'Fri', revenue: 48000 },
  { day: 'Sat', revenue: 72000 },
  { day: 'Sun', revenue: 31000 },
]

export const weeklyRevenueData = [
  { week: 'W1', revenue: 280000 },
  { week: 'W2', revenue: 345000 },
  { week: 'W3', revenue: 310000 },
  { week: 'W4', revenue: 425000 },
]

export const monthlyRevenueData = [
  { month: 'Oct', revenue: 520000 },
  { month: 'Nov', revenue: 680000 },
  { month: 'Dec', revenue: 750000 },
  { month: 'Jan', revenue: 890000 },
  { month: 'Feb', revenue: 620000 },
  { month: 'Mar', revenue: 950000 },
]

export interface ExpenseRecord {
  id: string
  category: 'Office Expenses' | 'Other Expenses' | 'Income'
  description: string
  amount: number
  date: string
}

export const expenses: ExpenseRecord[] = [
  { id: 'e1', category: 'Office Expenses', description: 'Office rent - March', amount: 45000, date: '2026-03-01' },
  { id: 'e2', category: 'Office Expenses', description: 'Internet & utilities', amount: 8500, date: '2026-03-05' },
  { id: 'e3', category: 'Other Expenses', description: 'Travel reimbursement - Anil', amount: 12000, date: '2026-03-08' },
  { id: 'e4', category: 'Other Expenses', description: 'Trade fair booth - Kerala Tourism', amount: 25000, date: '2026-03-10' },
  { id: 'e5', category: 'Income', description: 'Subscription - Ocean Breeze Resort', amount: 135000, date: '2026-03-01' },
  { id: 'e6', category: 'Income', description: 'Subscription - Kappad Heritage Inn', amount: 50000, date: '2026-02-01' },
]

// ---------- Travel Agents ----------
export type ContractType = 'Platinum' | 'Gold' | 'Silver' | 'Bronze'

export interface TravelAgent {
  id: string
  agentName: string
  contactNumber: string
  email: string
  trialStatus: boolean
  trialRemainingDays: number
  planStartDate: string
  planEndDate: string
  pendingAmount: number
  collectedAmount: number
  contractType: ContractType
  state: string
  district: string
  location: string
}

export const travelAgents: TravelAgent[] = [
  { id: 'ta1', agentName: 'Kerala Holidays Pvt Ltd', contactNumber: '+91 94567 12345', email: 'contact@keralaholidays.com', trialStatus: false, trialRemainingDays: 0, planStartDate: '2025-06-01', planEndDate: '2026-05-31', pendingAmount: 15000, collectedAmount: 85000, contractType: 'Platinum', state: 'Kerala', district: 'Kozhikode', location: 'Calicut Beach' },
  { id: 'ta2', agentName: 'Malabar Travels', contactNumber: '+91 85678 23456', email: 'info@malabartravels.in', trialStatus: true, trialRemainingDays: 12, planStartDate: '2026-03-01', planEndDate: '2026-03-31', pendingAmount: 0, collectedAmount: 0, contractType: 'Bronze', state: 'Kerala', district: 'Kozhikode', location: 'Kappad' },
  { id: 'ta3', agentName: 'Cochin Adventures', contactNumber: '+91 76789 34567', email: 'book@cochinadventures.com', trialStatus: false, trialRemainingDays: 0, planStartDate: '2025-09-15', planEndDate: '2026-09-14', pendingAmount: 25000, collectedAmount: 75000, contractType: 'Gold', state: 'Kerala', district: 'Ernakulam', location: 'Fort Kochi' },
  { id: 'ta4', agentName: 'South India Tours', contactNumber: '+91 98901 45678', email: 'hello@southindiatours.com', trialStatus: true, trialRemainingDays: 5, planStartDate: '2026-02-20', planEndDate: '2026-03-20', pendingAmount: 0, collectedAmount: 0, contractType: 'Silver', state: 'Kerala', district: 'Trivandrum', location: 'Kovalam' },
  { id: 'ta5', agentName: 'Goa Beach Holidays', contactNumber: '+91 87012 56789', email: 'info@goabeachholidays.com', trialStatus: false, trialRemainingDays: 0, planStartDate: '2025-12-01', planEndDate: '2026-11-30', pendingAmount: 30000, collectedAmount: 70000, contractType: 'Gold', state: 'Goa', district: 'North Goa', location: 'Baga' },
  { id: 'ta6', agentName: 'KTM Holidays', contactNumber: '+91 94432 11223', email: 'ops@ktmholidays.in', trialStatus: true, trialRemainingDays: 20, planStartDate: '2026-03-10', planEndDate: '2026-04-10', pendingAmount: 0, collectedAmount: 0, contractType: 'Bronze', state: 'Kerala', district: 'Ernakulam', location: 'Marine Drive' },
]

// ---------- Trade Fairs ----------
export interface TradeFairVenue {
  id: string
  location: string
  city: string
  venue: string
  date: string
}

export const tradeFairVenues: TradeFairVenue[] = [
  { id: 'tf1', location: 'Kerala', city: 'Kochi', venue: 'Lulu Convention Centre', date: '2026-04-15' },
  { id: 'tf2', location: 'Goa', city: 'Panaji', venue: 'Kala Academy', date: '2026-05-10' },
  { id: 'tf3', location: 'Karnataka', city: 'Bangalore', venue: 'BIEC', date: '2026-06-20' },
]

export type TradeFairStatus = 'Interested' | 'Requested Demo' | 'Connected' | 'Closed' | 'Payment Done'

export interface TradeFairProperty {
  id: string
  fairId: string
  propertyName: string
  contactPerson: string
  contactNumber: string
  email: string
  location: string
  status: TradeFairStatus
}

export const tradeFairProperties: TradeFairProperty[] = [
  { id: 'tfp1', fairId: 'tf1', propertyName: 'Alleppey Houseboat Resort', contactPerson: 'Manoj V', contactNumber: '+91 94567 88001', email: 'info@alleppeyhouseboat.com', location: 'Alleppey', status: 'Closed' },
  { id: 'tfp2', fairId: 'tf1', propertyName: 'Wayanad Hill Retreat', contactPerson: 'Asha Mohan', contactNumber: '+91 85678 77002', email: 'reservations@wayanadhill.com', location: 'Wayanad', status: 'Requested Demo' },
  { id: 'tfp3', fairId: 'tf1', propertyName: 'Thekkady Spice Village', contactPerson: 'George K', contactNumber: '+91 76789 66003', email: 'stay@spicevillage.in', location: 'Thekkady', status: 'Connected' },
  { id: 'tfp4', fairId: 'tf2', propertyName: 'Goa Heritage Villa', contactPerson: 'Maria F', contactNumber: '+91 83214 55004', email: 'book@goaheritage.com', location: 'Old Goa', status: 'Interested' },
  { id: 'tfp5', fairId: 'tf3', propertyName: 'Coorg Coffee Estate Stay', contactPerson: 'Kavitha R', contactNumber: '+91 94321 44005', email: 'stay@coorgcoffee.com', location: 'Coorg', status: 'Payment Done' },
]

export interface TradeFairAgent {
  id: string
  fairId: string
  agentName: string
  contactNumber: string
  email: string
  location: string
  isDMC: boolean
  status: TradeFairStatus
}

export const tradeFairAgents: TradeFairAgent[] = [
  { id: 'tfa1', fairId: 'tf1', agentName: 'Thomas Cook India', contactNumber: '+91 98765 11001', email: 'info@thomascook.in', location: 'Mumbai', isDMC: true, status: 'Connected' },
  { id: 'tfa2', fairId: 'tf1', agentName: 'MakeMyTrip B2B', contactNumber: '+91 87654 22002', email: 'b2b@makemytrip.com', location: 'Delhi', isDMC: false, status: 'Interested' },
  { id: 'tfa3', fairId: 'tf2', agentName: 'Goa Concierge', contactNumber: '+91 76543 33003', email: 'team@goaconcierge.com', location: 'Panaji', isDMC: true, status: 'Closed' },
  { id: 'tfa4', fairId: 'tf3', agentName: 'Karnataka Tours', contactNumber: '+91 94432 44004', email: 'ops@karnataka-tours.com', location: 'Bangalore', isDMC: false, status: 'Requested Demo' },
]

// ---------- Sales ----------
export type SalesStatus = 'Closed' | 'Installation Pending' | 'Interested' | 'Not Interested' | 'Rescheduled' | 'Under Maintenance'

export interface VisitRecord {
  date: string
  time: string
  status: string
  comment: string
  createdBy?: string
}

export interface SalesRecord {
  id: string
  slno: number
  propertyName: string
  numberOfRooms: number
  email: string
  primaryContactPerson: string
  designation: string
  proposedPrice: number
  planType: '6 Month' | '1 Year'
  status: SalesStatus
  comments: string
  demoProvided: boolean
  trialProvided: boolean
  installed: boolean
  executive: string
  state: string
  district: string
  location: string
  locationLink?: string
  isLive: boolean
  visitHistory: VisitRecord[]
}

export const salesRecords: SalesRecord[] = [
  { 
    id: 's1', slno: 1, propertyName: 'Ocean Breeze Resort', numberOfRooms: 45, email: 'info@oceanbreeze.com', 
    primaryContactPerson: 'Rajesh Kumar', designation: 'Manager', proposedPrice: 150000, planType: '1 Year', 
    status: 'Closed', comments: 'Premium client. Full OTA integration done.', demoProvided: true, trialProvided: true, 
    installed: true, executive: 'Anil Menon', state: 'Kerala', district: 'Kozhikode', location: 'Calicut Beach',
    locationLink: 'https://maps.google.com',
    isLive: true,
    visitHistory: [
      { date: '2026-03-01', time: '10:00 AM', status: 'Interested', comment: 'Initial discussion, client liked the UI.' },
      { date: '2026-03-05', time: '02:00 PM', status: 'Requested Demo', comment: 'Full demo given to the owner.' },
      { date: '2026-03-10', time: '11:00 AM', status: 'Closed', comment: 'Contract signed and payment done.' },
    ]
  },
  { 
    id: 's2', slno: 2, propertyName: 'Kappad Heritage Inn', numberOfRooms: 18, email: 'book@kappadinn.in', 
    primaryContactPerson: 'Priya Nair', designation: 'Owner', proposedPrice: 85000, planType: '1 Year', 
    status: 'Closed', comments: 'Smooth onboarding.', demoProvided: true, trialProvided: false, 
    installed: true, executive: 'Deepa S', state: 'Kerala', district: 'Kozhikode', location: 'Kappad',
    locationLink: 'https://maps.google.com',
    isLive: true,
    visitHistory: [
      { date: '2026-02-15', time: '03:30 PM', status: 'Interested', comment: 'Met owner Priya.' },
      { date: '2026-02-20', time: '10:00 AM', status: 'Closed', comment: 'Closing call successful.' },
    ]
  },
  { 
    id: 's3', slno: 3, propertyName: 'Marine Drive Suites', numberOfRooms: 28, email: 'info@marinedrivesuites.com', 
    primaryContactPerson: 'Meera Krishnan', designation: 'Front Office', proposedPrice: 120000, planType: '1 Year', 
    status: 'Interested', comments: 'Evaluating competitors. Follow up in 2 weeks.', demoProvided: true, trialProvided: true, 
    installed: false, executive: 'Rajan K', state: 'Kerala', district: 'Ernakulam', location: 'Marine Drive',
    isLive: false,
    visitHistory: [
      { date: '2026-03-12', time: '04:30 PM', status: 'Interested', comment: 'Checking trial features.' },
    ]
  },
  { 
    id: 's4', slno: 4, propertyName: 'Whitefield Business Lodging', numberOfRooms: 16, email: 'book@wflodging.in', 
    primaryContactPerson: 'Kavitha M', designation: 'HR', proposedPrice: 55000, planType: '6 Month', 
    status: 'Rescheduled', comments: 'Budget constraints. April follow-up.', demoProvided: true, trialProvided: false, 
    installed: false, executive: 'Vishal P', state: 'Karnataka', district: 'Bangalore', location: 'Whitefield',
    isLive: false,
    visitHistory: [
      { date: '2026-03-01', time: '11:00 AM', status: 'Interested', comment: 'HR requested budget approval.' },
    ]
  },
  { 
    id: 's5', slno: 5, propertyName: 'Palolem Beach Resort', numberOfRooms: 32, email: 'info@palolemresort.com', 
    primaryContactPerson: 'Carlos M', designation: 'Owner', proposedPrice: 130000, planType: '1 Year', 
    status: 'Not Interested', comments: 'Using competitor. Not switching.', demoProvided: true, trialProvided: false, 
    installed: false, executive: 'Anil Menon', state: 'Goa', district: 'South Goa', location: 'Palolem',
    isLive: false,
    visitHistory: [
      { date: '2026-03-05', time: '10:00 AM', status: 'Not Interested', comment: 'Happy with current PMS.' },
    ]
  },
  { 
    id: 's6', slno: 6, propertyName: 'Fort Kochi Grand Hotel', numberOfRooms: 72, email: 'reservations@fkgrand.com', 
    primaryContactPerson: 'Anitha George', designation: 'Manager', proposedPrice: 250000, planType: '1 Year', 
    status: 'Closed', comments: 'Enterprise client.', demoProvided: true, trialProvided: true, 
    installed: true, executive: 'Anil Menon', state: 'Kerala', district: 'Ernakulam', location: 'Fort Kochi',
    isLive: true,
    visitHistory: [
      { date: '2026-02-10', time: '09:00 AM', status: 'Interested', comment: 'Large scale requirement.' },
      { date: '2026-02-25', time: '03:00 PM', status: 'Closed', comment: 'Approved by board.' },
    ]
  },
  { 
    id: 's7', slno: 7, propertyName: 'Baga Beachfront Hotel', numberOfRooms: 25, email: 'info@bagabeachfront.com', 
    primaryContactPerson: "Rahul D'Souza", designation: 'Owner', proposedPrice: 110000, planType: '1 Year', 
    status: 'Installation Pending', comments: 'Payment done. Awaiting setup.', demoProvided: true, trialProvided: true, 
    installed: false, executive: 'Anil Menon', state: 'Goa', district: 'North Goa', location: 'Baga',
    isLive: false,
    visitHistory: [
      { date: '2026-03-14', time: '02:00 PM', status: 'Installation Pending', comment: 'Staff training scheduled.' },
    ]
  },
]
export interface AgendaItem {
  time: string
  title: string
  location: string
  type: string
}

// ---------- Executive ----------
export interface Executive {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  closings: number
  revenueGenerated: number
  demosGiven: number
  trialsProvided: number
  todayVisits: number
  todayRevenue: number
  todayClosings: number
  targetClosings: number
  monthlyPerformance: {
    month: string
    closings: number
    revenue: number
    target: number
  }[]
  agenda: AgendaItem[]
}

export const executives: Executive[] = [
  { 
    id: 'ex1', name: 'Anil Menon', email: 'anil@bookito.in', avatar: 'AM', role: 'Senior Sales Executive', 
    closings: 28, revenueGenerated: 3250000, demosGiven: 45, trialsProvided: 18, 
    todayVisits: 3, todayRevenue: 135000, todayClosings: 1, targetClosings: 40,
    monthlyPerformance: [
      { month: 'Oct', closings: 25, revenue: 2800000, target: 35 },
      { month: 'Nov', closings: 30, revenue: 3500000, target: 35 },
      { month: 'Dec', closings: 22, revenue: 2400000, target: 35 },
      { month: 'Jan', closings: 35, revenue: 4100000, target: 40 },
      { month: 'Feb', closings: 28, revenue: 3250000, target: 40 },
      { month: 'Mar', closings: 18, revenue: 2100000, target: 40 },
    ],
    agenda: [
      { title: 'Visit: Ocean Breeze Resort', time: '10:00 AM', location: 'Calicut Beach', type: 'Follow-up' },
      { title: 'Payment Collection: Fort Kochi Grand', time: '02:30 PM', location: 'Fort Kochi', type: 'Closing' },
      { title: 'Product Setup: Baga Beachfront', time: '04:00 PM', location: 'Baga', type: 'Installation' },
    ]
  },
  { 
    id: 'ex2', name: 'Deepa S', email: 'deepa@bookito.in', avatar: 'DS', role: 'Sales Executive', 
    closings: 22, revenueGenerated: 2870000, demosGiven: 38, trialsProvided: 15, 
    todayVisits: 2, todayRevenue: 0, todayClosings: 0, targetClosings: 40,
    monthlyPerformance: [
      { month: 'Oct', closings: 20, revenue: 2300000, target: 30 },
      { month: 'Nov', closings: 25, revenue: 3000000, target: 30 },
      { month: 'Dec', closings: 18, revenue: 2100000, target: 30 },
      { month: 'Jan', closings: 28, revenue: 3400000, target: 40 },
      { month: 'Feb', closings: 22, revenue: 2870000, target: 40 },
      { month: 'Mar', closings: 15, revenue: 1900000, target: 40 },
    ],
    agenda: [
      { title: 'Demo: Kappad Inn', time: '11:30 AM', location: 'Kappad', type: 'New Demo' },
      { title: 'Contract Signing: Sea View', time: '03:00 PM', location: 'Beypore', type: 'Closing' },
    ]
  },
  { 
    id: 'ex3', name: 'Rajan K', email: 'rajan@bookito.in', avatar: 'RK', role: 'Sales Executive', 
    closings: 19, revenueGenerated: 2150000, demosGiven: 32, trialsProvided: 12, 
    todayVisits: 4, todayRevenue: 85000, todayClosings: 1, targetClosings: 35,
    monthlyPerformance: [
      { month: 'Oct', closings: 18, revenue: 1900000, target: 25 },
      { month: 'Nov', closings: 22, revenue: 2500000, target: 25 },
      { month: 'Dec', closings: 15, revenue: 1700000, target: 25 },
      { month: 'Jan', closings: 24, revenue: 2800000, target: 35 },
      { month: 'Feb', closings: 19, revenue: 2150000, target: 35 },
      { month: 'Mar', closings: 12, revenue: 1400000, target: 35 },
    ],
    agenda: [
      { title: 'Morning Briefing', time: '09:00 AM', location: 'Office', type: 'Meeting' },
      { title: 'Client Meeting: Marine Drive', time: '11:00 AM', location: 'Kochi', type: 'Relationship' },
    ]
  },
  { 
    id: 'ex4', name: 'Meera Nair', email: 'meera@bookito.in', avatar: 'MN', role: 'Junior Sales Executive', 
    closings: 15, revenueGenerated: 1780000, demosGiven: 28, trialsProvided: 10, 
    todayVisits: 1, todayRevenue: 0, todayClosings: 0, targetClosings: 30,
    monthlyPerformance: [
      { month: 'Oct', closings: 12, revenue: 1400000, target: 20 },
      { month: 'Nov', closings: 18, revenue: 2100000, target: 20 },
      { month: 'Dec', closings: 14, revenue: 1600000, target: 20 },
      { month: 'Jan', closings: 20, revenue: 2400000, target: 30 },
      { month: 'Feb', closings: 15, revenue: 1780000, target: 30 },
      { month: 'Mar', closings: 10, revenue: 1200000, target: 30 },
    ],
    agenda: [
      { title: 'Training Session', time: '10:00 AM', location: 'Online', type: 'Internal' },
    ]
  },
  { 
    id: 'ex5', name: 'Vishal P', email: 'vishal@bookito.in', avatar: 'VP', role: 'Junior Sales Executive', 
    closings: 12, revenueGenerated: 1400000, demosGiven: 22, trialsProvided: 8, 
    todayVisits: 2, todayRevenue: 55000, todayClosings: 0, targetClosings: 25,
    monthlyPerformance: [
      { month: 'Oct', closings: 10, revenue: 1100000, target: 15 },
      { month: 'Nov', closings: 14, revenue: 1600000, target: 15 },
      { month: 'Dec', closings: 12, revenue: 1400000, target: 15 },
      { month: 'Jan', closings: 18, revenue: 2100000, target: 25 },
      { month: 'Feb', closings: 12, revenue: 1400000, target: 25 },
      { month: 'Mar', closings: 8, revenue: 950000, target: 25 },
    ],
    agenda: [
      { title: 'Property Scouting', time: '11:00 AM', location: 'Bangalore', type: 'Direct' },
    ]
  },
]

// ---------- Notifications ----------
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  time: string
  read: boolean
}

export const notifications: Notification[] = [
  { id: 'n1', title: 'Plan Expiry Alert', message: 'Kovalam Beach Resort plan expires in 4 days', type: 'warning', time: '2 hours ago', read: false },
  { id: 'n2', title: 'New Closing', message: 'Anil Menon closed Ocean Breeze Resort for ₹1,35,000', type: 'success', time: '3 hours ago', read: false },
  { id: 'n3', title: 'Payment Received', message: 'Kappad Heritage Inn paid ₹50,000', type: 'success', time: '5 hours ago', read: true },
  { id: 'n4', title: 'Demo Scheduled', message: 'Marine Drive Suites demo scheduled for tomorrow', type: 'info', time: '6 hours ago', read: true },
  { id: 'n5', title: 'Feature Update', message: 'Channel Manager v2.5 released with Airbnb integration', type: 'info', time: 'Yesterday', read: false },
  { id: 'n6', title: 'Bug Report', message: 'Agent portal login issue reported by Kerala Holidays', type: 'error', time: 'Yesterday', read: true },
]

// ---------- Feature List ----------
export interface Feature {
  id: string
  name: string
  description: string
  version: string
  date: string
}

export const features: Feature[] = [
  { id: 'feat1', name: 'Channel Manager v2.5', description: 'Airbnb integration, real-time sync, bulk rate update', version: '2.5.0', date: '2026-03-10' },
  { id: 'feat2', name: 'OTA Dashboard', description: 'Unified OTA performance dashboard with analytics', version: '2.4.0', date: '2026-02-28' },
  { id: 'feat3', name: 'Smart Pricing', description: 'AI-powered dynamic pricing suggestions', version: '2.3.0', date: '2026-02-15' },
  { id: 'feat4', name: 'Guest Reviews', description: 'Centralized review management across all OTAs', version: '2.2.0', date: '2026-01-30' },
]
