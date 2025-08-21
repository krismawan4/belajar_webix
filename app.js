// Data Model dan Mock Data untuk Mahasiswa
let studentData = [
    {
        id: 1,
        nim: "2021001001",
        nama: "Ahmad Rizki",
        jurusan: "Teknik Informatika",
        semester: 6,
        ipk: 3.75,
        email: "ahmad.rizki@email.com",
        telepon: "081234567890"
    },
    {
        id: 2,
        nim: "2021001002", 
        nama: "Siti Nurhaliza",
        jurusan: "Sistem Informasi",
        semester: 4,
        ipk: 3.82,
        email: "siti.nurhaliza@email.com",
        telepon: "081234567891"
    },
    {
        id: 3,
        nim: "2021001003",
        nama: "Budi Santoso",
        jurusan: "Teknik Komputer",
        semester: 2,
        ipk: 3.45,
        email: "budi.santoso@email.com",
        telepon: "081234567892"
    },
    {
        id: 4,
        nim: "2021001004",
        nama: "Maya Sari",
        jurusan: "Teknik Informatika",
        semester: 8,
        ipk: 3.91,
        email: "maya.sari@email.com",
        telepon: "081234567893"
    },
    {
        id: 5,
        nim: "2021001005",
        nama: "Dedi Kurniawan",
        jurusan: "Sistem Informasi",
        semester: 6,
        ipk: 3.67,
        email: "dedi.kurniawan@email.com",
        telepon: "081234567894"
    }
];

// Fungsi untuk generate ID baru
function getNextId() {
    return Math.max(...studentData.map(s => s.id)) + 1;
}

// Inisialisasi aplikasi Webix
webix.ready(function() {
    // Definisi form untuk input/edit mahasiswa
    const studentForm = {
        view: "form",
        id: "studentForm",
        width: 400,
        elements: [
            {
                view: "text",
                name: "nim",
                label: "NIM",
                labelWidth: 100,
                required: true,
                placeholder: "Masukkan NIM"
            },
            {
                view: "text", 
                name: "nama",
                label: "Nama",
                labelWidth: 100,
                required: true,
                placeholder: "Masukkan nama lengkap"
            },
            {
                view: "select",
                name: "jurusan",
                label: "Jurusan",
                labelWidth: 100,
                required: true,
                options: [
                    "Teknik Informatika",
                    "Sistem Informasi", 
                    "Teknik Komputer",
                    "Manajemen Informatika"
                ]
            },
            {
                view: "counter",
                name: "semester",
                label: "Semester",
                labelWidth: 100,
                min: 1,
                max: 14,
                value: 1
            },
            {
                view: "text",
                name: "ipk",
                label: "IPK",
                labelWidth: 100,
                placeholder: "0.00 - 4.00"
            },
            {
                view: "text",
                name: "email", 
                label: "Email",
                labelWidth: 100,
                placeholder: "email@example.com"
            },
            {
                view: "text",
                name: "telepon",
                label: "Telepon",
                labelWidth: 100,
                placeholder: "081234567890"
            },
            {
                margin: 10,
                cols: [
                    {
                        view: "button",
                        value: "Simpan",
                        css: "webix_primary",
                        click: saveStudent
                    },
                    {
                        view: "button", 
                        value: "Reset",
                        click: resetForm
                    },
                    {
                        view: "button",
                        value: "Batal",
                        click: cancelEdit
                    }
                ]
            }
        ],
        rules: {
            nim: webix.rules.isNotEmpty,
            nama: webix.rules.isNotEmpty,
            jurusan: webix.rules.isNotEmpty,
            ipk: function(value) {
                return value >= 0 && value <= 4;
            }
        }
    };

    // Definisi DataTable untuk menampilkan data mahasiswa
    const studentTable = {
        view: "datatable",
        id: "studentTable", 
        columns: [
            { id: "nim", header: "NIM", width: 120, sort: "string" },
            { id: "nama", header: "Nama", width: 180, sort: "string" },
            { id: "jurusan", header: "Jurusan", width: 150, sort: "string" },
            { id: "semester", header: "Semester", width: 80, sort: "int" },
            { id: "ipk", header: "IPK", width: 80, sort: "string", format: function(value) {
                return parseFloat(value).toFixed(2);
            }},
            { id: "email", header: "Email", width: 180 },
            { id: "telepon", header: "Telepon", width: 130 },
            { 
                id: "actions", 
                header: "Aksi", 
                width: 100,
                template: function(obj) {
                    return '<button class="edit-btn" onclick="editStudent(' + obj.id + ')">Edit</button> ' +
                           '<button class="delete-btn" onclick="deleteStudent(' + obj.id + ')">Hapus</button>';
                }
            }
        ],
        select: "row",
        resizeColumn: true,
        data: studentData,
        css: "webix_header_border"
    };

    // Layout utama aplikasi
    webix.ui({
        container: "app",
        rows: [
            {
                view: "toolbar",
                padding: 10,
                elements: [
                    { 
                        view: "label", 
                        label: "Data Mahasiswa",
                        css: "webix_strong"
                    },
                    {},
                    {
                        view: "button",
                        value: "Tambah Mahasiswa",
                        width: 150,
                        css: "webix_primary",
                        click: function() {
                            resetForm();
                            $$("studentForm").show();
                        }
                    }
                ]
            },
            {
                cols: [
                    studentTable,
                    {
                        width: 420,
                        rows: [
                            {
                                view: "label",
                                label: "Form Input Mahasiswa",
                                css: "webix_strong",
                                height: 30
                            },
                            studentForm
                        ]
                    }
                ]
            }
        ]
    });

    // Load data awal
    $$("studentTable").clearAll();
    $$("studentTable").parse(studentData);
});

// Variabel untuk tracking mode edit
let editingId = null;

// Fungsi untuk menyimpan data mahasiswa
function saveStudent() {
    const form = $$("studentForm");
    
    if (!form.validate()) {
        webix.message({type: "error", text: "Mohon lengkapi semua field yang required!"});
        return;
    }
    
    const values = form.getValues();
    
    // Validasi IPK
    if (values.ipk && (parseFloat(values.ipk) < 0 || parseFloat(values.ipk) > 4)) {
        webix.message({type: "error", text: "IPK harus antara 0.00 - 4.00!"});
        return;
    }

    // Cek duplikasi NIM (kecuali untuk edit data yang sama)
    const existingStudent = studentData.find(s => s.nim === values.nim && s.id !== editingId);
    if (existingStudent) {
        webix.message({type: "error", text: "NIM sudah digunakan oleh mahasiswa lain!"});
        return;
    }
    
    if (editingId) {
        // Update data yang sudah ada
        const index = studentData.findIndex(s => s.id === editingId);
        if (index !== -1) {
            studentData[index] = {
                ...studentData[index],
                ...values,
                ipk: parseFloat(values.ipk || 0)
            };
            $$("studentTable").updateItem(editingId, studentData[index]);
            webix.message({type: "success", text: "Data mahasiswa berhasil diupdate!"});
        }
    } else {
        // Tambah data baru
        const newStudent = {
            id: getNextId(),
            ...values,
            ipk: parseFloat(values.ipk || 0)
        };
        studentData.push(newStudent);
        $$("studentTable").add(newStudent);
        webix.message({type: "success", text: "Mahasiswa berhasil ditambahkan!"});
    }
    
    resetForm();
}

// Fungsi untuk reset form
function resetForm() {
    $$("studentForm").clear();
    $$("studentForm").clearValidation();
    editingId = null;
}

// Fungsi untuk cancel edit
function cancelEdit() {
    resetForm();
}

// Fungsi untuk edit mahasiswa
function editStudent(id) {
    const student = studentData.find(s => s.id === id);
    if (student) {
        $$("studentForm").setValues(student);
        editingId = id;
        webix.message({type: "info", text: "Mode edit: " + student.nama});
    }
}

// Fungsi untuk hapus mahasiswa
function deleteStudent(id) {
    const student = studentData.find(s => s.id === id);
    if (student) {
        webix.confirm({
            title: "Konfirmasi Hapus",
            text: "Apakah Anda yakin ingin menghapus data " + student.nama + "?",
            callback: function(result) {
                if (result) {
                    // Hapus dari array
                    const index = studentData.findIndex(s => s.id === id);
                    if (index !== -1) {
                        studentData.splice(index, 1);
                    }
                    
                    // Hapus dari table
                    $$("studentTable").remove(id);
                    
                    // Reset form jika sedang mengedit data yang dihapus
                    if (editingId === id) {
                        resetForm();
                    }
                    
                    webix.message({type: "success", text: "Data mahasiswa berhasil dihapus!"});
                }
            }
        });
    }
}