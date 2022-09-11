const _table = {
    tBody: [],
    drawPlayers: function (number = 0, size = 3) {
        const self = this;
        const params = {
            action: '/rest/players',
            type: 'get',
            pageSize: size,
            pageNumber: number,
        };
        const request = new _glob.request(params);
        request.send((response) => {
            let row = '';
            response.forEach(function (item, i, response) {
                row += `<tr data-id="${item.id}">
                          <th scope="row">${item.id}</th>
                          <td>${item.name}</td>
                          <td>${item.title}</td>
                          <td>${item.race}</td>
                          <td>${item.profession}</td>
                          <td>${item.level}</td>
                          <td>${new Date(item.birthday).toLocaleDateString()}</td>
                          <td>${item.banned}</td>
                        </tr>`;
            });
            self.tBody.html(row);
            _pagination.draw(size, number);
        });
    },
    run: function () {
        this.tBody = $('.table').find('tbody');
        if (this.tBody.length) {
            this.drawPlayers()
        }
    }
}
const _pagination = {
    size: 3,
    currentPage: 1,
    inner: [],
    draw: function (size, number) {
        if (!this.inner.length) {
            this.run();
        }
        const self = this;
        this.size = size;
        this.currentPage = number + 1;
        const params = {
            action: '/rest/players/count',
            type: 'get'
        };
        const request = new _glob.request(params);
        request.send((response) => {
            const count = Math.ceil(response / self.size);
            if (count <= 1) {
                return;
            }
            let nav = '';
            for (let i = 1; i <= count; i++) {
                nav += `<li class="page-item ${i === self.currentPage ? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`;
            }
            self.inner.html(nav);
        });
    },
    choose: function () {
        const self = this;
        this.inner.on('click', '.page-item', function (event) {
            event.preventDefault();
            let num = parseInt($(this).find('a').text());
            if (num === self.currentPage) {
                return;
            }
            _table.drawPlayers(num - 1, self.size);
        });
    },
    select: function () {
        const self = this;
        $('body').on('change', '.custom-select', function (event) {
            let size = parseInt($(this).val());
            if (size) {
                self.size = size;
                self.currentPage = 1;
            }
            _table.drawPlayers(self.currentPage - 1, self.size);
        });
    },
    run: function () {
        this.inner = $('.pagination');
        if (this.inner.length) {
            this.choose();
            this.select();
        }
    }
}
$(document).ready(function () {
    _glob.run();
    _table.run();
})