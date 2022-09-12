const _race = {
    HUMAN: 'HUMAN',
    DWARF: 'DWARF',
    ELF: 'ELF',
    GIANT: 'GIANT',
    ORC: 'ORC',
    TROLL: 'TROLL',
    HOBBIT: 'HOBBIT'
};
const _profession = {
    WARRIOR: 'WARRIOR',
    ROGUE: 'ROGUE',
    SORCERER: 'SORCERER',
    CLERIC: 'CLERIC',
    PALADIN: 'PALADIN',
    NAZGUL: 'NAZGUL',
    WARLOCK: 'WARLOCK',
    DRUID: 'DRUID'
};
const _table = {
    tBody: [],
    drawPlayers: function () {
        const self = this;
        const params = {
            action: '/rest/players',
            type: 'get',
            pageSize: _pagination.size,
            pageNumber: _pagination.currentPage - 1,
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
                          <td><img src="/img/edit.png" alt="" class="edit"></td>
                          <td><img src="/img/delete.png" alt="" class="delete"></td>
                        </tr>`;
            });
            self.tBody.html(row);
            _pagination.draw();
        });
    },
    actionPlayer: function () {
        const self = this;
        this.tBody.on('click', 'tr img', function (event) {
            const img = $(this);
            const id = parseInt(img.closest('tr').attr('data-id'));
            if (!id) {
                return;
            }
            if (img.hasClass('delete')) {
                self.deletePlayer(id);
            }
            if (img.hasClass('edit')) {
                self.editPlayer(id);
            }
            if (img.hasClass('save')) {
                self.savePlayer(id);
            }
        });
    },
    deletePlayer: function (id) {
        const self = this;
        let params = {
            action: '/rest/players/' + id,
            type: 'delete',
        };
        const request = new _glob.request(params);
        request.send((response) => {
            if (response.status === 200) {
                _table.drawPlayers();
            }
        });
    },
    editPlayer: function (id) {
        const self = this;
        const selector = '[data-id="' + id + '"]';
        const tr = $(selector);
        const td = tr.find('td');
        if (tr.length && td.length) {
            let object = {};
            $.each(td, function (i, item) {
                if (i <= 6) {
                    switch (i) {
                        case 0:
                            object['name'] = item.innerHTML;
                            break;
                        case 1:
                            object['title'] = item.innerHTML;
                            break;
                        case 2:
                            object['race'] = item.innerHTML;
                            break;
                        case 3:
                            object['profession'] = item.innerHTML;
                            break;
                        case 4:
                            object['level'] = item.innerHTML;
                            break;
                        case 5:
                            object['birthday'] = item.innerHTML;
                            break;
                        case 6:
                            object['banned'] = item.innerHTML;
                            break;
                    }
                }
            });
            let selectRace = `<select class="custom-select my-1 mr-sm-2" name="race">`;
            for (let key in _race) {
                selectRace += `<option value="${key}" ${(key === object.race ? 'selected' : '')}>${_race[key]}</option>`;
            }
            selectRace += `</select>`;
            let selectProfession = `<select class="custom-select my-1 mr-sm-2" name="profession">`;
            for (let key in _profession) {
                selectProfession += `<option value="${key}" ${(key === object.profession ? 'selected' : '')}>${_profession[key]}</option>`;
            }
            selectProfession += `</select>`;
            const row = `<th scope="row">${id}</th>
                            <td><input class="form-control" type="text" name="name" value="${object.name}"></td>
                            <td><input class="form-control" type="text" name="title" value="${object.title}"></td>
                            <td>${selectRace}</td>
                            <td>${selectProfession}</td>
                            <td>${object.level}</td>
                            <td>${object.birthday}</td>
                            <td>
                                <input type="checkbox" class="form-check-input" id="exampleCheck1" name="banned" ${object.banned === 'true' ? 'checked' : ''}>
                                <label class="form-check-label" for="exampleCheck1">Banned</label>
                            </td>
                            <td><img src="/img/save.png" alt="" class="save"></td>
                            <td><img src="/img/delete.png" alt="" class="delete"></td>`;
            tr.html(row);
        }
    },
    savePlayer: function (id) {
        const self = this;
        const selector = '[data-id="' + id + '"]';
        const tr = $(selector);
        let params = {
            action: '/rest/players/' + id,
            type: 'post',
        };
        tr.find('input, textearea, select').each(function () {
            if (this.name === 'banned') {
                params[this.name] = $(this).is(":checked");
            } else {
                params[this.name] = $(this).val();
            }
        });
        _cl_(params);
        const request = new _glob.request(params).setIsForm();
        request.send((response) => {
            let row = '';
            row += `<th scope="row">${response.id}</th>
                          <td>${response.name}</td>
                          <td>${response.title}</td>
                          <td>${response.race}</td>
                          <td>${response.profession}</td>
                          <td>${response.level}</td>
                          <td>${new Date(response.birthday).toLocaleDateString()}</td>
                          <td>${response.banned}</td>
                          <td><img src="/img/edit.png" alt="" class="edit"></td>
                          <td><img src="/img/delete.png" alt="" class="delete"></td>`;
            tr.html(row);
        });
    },
    createPlayer: function () {
        const self = this;
        const request = new _glob.request().setIsForm();
        $('body').on('click', '.js-submit', function (event) {
            event.preventDefault();
            const form = $(this).closest('form');
            let params = {
                action: '/rest/players',
                type: 'post',
            };
            form.find('input, textearea, select').each(function () {
                if (this.name === 'banned') {
                    params[this.name] = $(this).is(":checked");
                } else if (this.name === 'name') {
                    params[this.name] = $(this).val().slice(0, 12);
                } else if (this.name === 'title') {
                    params[this.name] = $(this).val().slice(0, 30);
                } else if (this.name === 'birthday') {
                    params[this.name] = new Date($(this).val()).getTime();
                } else if (this.name === 'level') {
                    const lvl = parseInt($(this).val().replace(/[^0-9]/g, ''));
                    if (lvl > 100 || lvl <= 0) {
                        $(this).val('');
                    } else {
                        params[this.name] = lvl;
                    }
                } else {
                    params[this.name] = $(this).val();
                }
            });
            request.validateForm(form).setObject(params).send((response) => {
                if (response) {
                    form[0].reset();
                    _table.drawPlayers();
                }
            });
        });
    },
    run: function () {
        this.tBody = $('.table').find('tbody');
        if (this.tBody.length) {
            this.drawPlayers();
            this.actionPlayer();
            this.createPlayer();
        }
    }
}
const _pagination = {
    size: 3,
    currentPage: 1,
    inner: [],
    draw: function () {
        if (!this.inner.length) {
            this.run();
        }
        const self = this;
        const params = {
            action: '/rest/players/count',
            type: 'get'
        };
        const request = new _glob.request(params);
        request.send((response) => {
            const count = Math.ceil(response / self.size);
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
            self.currentPage = num;
            _table.drawPlayers();
        });
    },
    select: function () {
        const self = this;
        $('body').on('change', '.js-pagination-select', function (event) {
            let size = parseInt($(this).val());
            if (size) {
                self.size = size;
                self.currentPage = 1;
            }
            _table.drawPlayers();
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