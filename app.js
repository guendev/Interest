const ready = callback => {
    if (document.readyState !== 'loading') callback()
    else document.addEventListener('DOMContentLoaded', callback)
};

ready(() => {
    tinhLaiSuat()
})

function tinhLaiSuat() {
    const form = document.querySelector('#form')
    form.addEventListener('submit', (e)=> {
        e.preventDefault()
        const sotien = form.querySelector('#sotien').value
        const thoigian = form.querySelector('#thoigian').value
        const laisuat = form.querySelector('#laisuat').value
        const ngaygiaingan = form.querySelector('#ngaygiaingan').value

        try {
            const Controller = new TinhLaiSuat(parseInt(sotien), parseInt(thoigian), parseInt(laisuat), ngaygiaingan)
            Controller.tinhToan()
        } catch ({ message }) {
            window.alert(message)
        }
    })
}

class TinhLaiSuat {
    constructor(sotien, thoigian, laisuat, ngaygiaingan) {
        TinhLaiSuat.validateParams(sotien, thoigian, laisuat, ngaygiaingan)
        this.sotien = sotien
        this.thoigian = Math.round(thoigian)
        this.laisuat = laisuat
        // timestap mili giây
        this.ngaygiaingan = new Date(ngaygiaingan)
    }

    tinhToan() {
        const tienGoc = this.sotien / this.thoigian
        const laisuatthang = this.laisuat / 12
        let html = ''
        html += `<tr class="border-b border-gray-200 hover:bg-gray-100"><td class="py-3 px-6 text-center"><div class="flex items-center"><span class="font-medium">${this.getTimeFormart(this.ngaygiaingan)}</span><span class="font-medium ml-auto">0</span></div></td><td class="py-3 px-6 text-center"><div class="flex items-center"><span>${this.sotien}</span></div></td><td class="py-3 px-6 text-center"></td><td class="py-3 px-6 text-center"></td><td class="py-3 px-6 text-center"></td></tr>`
        let tonglai = 0
        for (let i = 0; i < this.thoigian + 1 ; i++) {
            if (i === 0) {
                // số tiền gốc...=> ko tính toán
                continue;
            }
            // tháng thứ i
            // số tiền còn lại
            const tienconlai = this.tinhTienConlai(tienGoc, i)
            // lãi mỗi tháng, lãi là tính gốc của tháng trước
            const laimoithang = this.tinhLaiMoiThang(tienconlai + tienGoc, laisuatthang)
            tonglai += laimoithang
            html += '<tr class="border-b border-gray-200 hover:bg-gray-100">'
            for (let i2 = 0; i2 < 5; i2++) {
                html += '<td class="py-3 px-6 text-center">'
                if (i2 === 0) {
                    html += `<div class="flex items-center"><span class="font-medium">${this.getTimeFormart(this.getNextMouth(this.ngaygiaingan, i))}</span><span class="font-medium ml-auto">${i}</span></div>`
                } else if (i2 === 1) {
                    html += `<div class="flex items-center"><span>${parseFloat(tienconlai).toFixed(3)}</span></div>`
                } else if (i2 === 2) {
                    html += `<div class="flex items-center justify-center"><span>${parseFloat(tienGoc).toFixed(2)}</span></div>`
                } else if (i2 === 3) {
                    html += `<div class="flex items-center justify-center"><span>${parseFloat(laimoithang).toFixed(3)}</span></div>`
                } else {
                    html += `<div class="flex items-center justify-center"><span>${parseFloat(laimoithang + tienGoc).toFixed(3)}</span></div>`
                }

                html += '</td>'
            }
            html += '</tr>'
        }
        html += `<tr class="border-b border-gray-200 hover:bg-gray-100"><td class="py-3 px-6 text-center"><div class="flex items-center"><span class="font-medium">Tổng</span></div></td><td class="py-3 px-6 text-center"><div class="flex items-center"></div></td><td class="py-3 px-6 text-center"><span class="font-medium">${this.sotien}</span></td><td class="py-3 px-6 text-center"><span class="font-medium">${parseFloat(tonglai).toFixed(2)}</span></td><td class="py-3 px-6 text-center"><span class="font-medium">${parseFloat(tonglai + this.sotien).toFixed(2)}</span></td></tr>`
        document.querySelector('#table-results tbody').innerHTML = ''
        document.querySelector('#table-results tbody').insertAdjacentHTML('beforeend', html)
    }

    tinhTienConlai(tienGoc, i) {
        return this.sotien - tienGoc * i;
    }

    tinhLaiMoiThang(tien, laisuat) {
        return tien * laisuat / 100
    }

    getNextMouth(d, mouth) {
        return new Date(d.getFullYear(), d.getMonth()+ mouth, d.getDay())
    }

    getTimeFormart(d, prefix = '/') {
        // return d.getDay() + prefix + d.getMonth() + prefix + d.getFullYear()
        return d.toLocaleDateString()
    }

    static validateParams(sotien, thoigian, laisuat, ngaygiaingan) {
        if (!sotien || typeof sotien !== 'number' || sotien <= 0) {
            console.log(sotien)
            throw new Error('Số tiền vay không hợp lệ')
        }
        if (!thoigian || typeof thoigian !== 'number' || thoigian < 1) {
            // vay tối thiểu 1 tháng
            throw new Error('Thời gian vay không hợp lệ')
        }
        if (!laisuat || typeof laisuat !== 'number' || laisuat <= 0) {
            throw new Error('Lãi suất vay không hợp lệ')
        }
        if (!ngaygiaingan || typeof ngaygiaingan !== 'string') {
            throw new Error('Ngày giải ngân không hợp lệ')
        }
    }
}
