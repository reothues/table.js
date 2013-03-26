$.createClass = function (text) {
    var head = document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            rules = document.createTextNode(text);
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = rules.nodeValue;
    }
    else {
        style.appendChild(rules);
    }
    head.appendChild(style);
}
$.fn.table = function () {
    $doms = this;
    $.each($($doms), function (idxThis, domThis) {
        var self = $(domThis);
        $.extend(self, {
            initPaging: function () {
                var showSize = parseInt(self.attr("pagesize"));
                //var _rows = self.rows.
                if (showSize >= self.rows.size()) return;
                var pagesize = Math.ceil(self.rows.size() / showSize);
                var pager = self.find(".page")[0] ? self.find(".page").parent() : $('<tfoot><tr><td colspan="' + self.head.find("th").size().toString() + '" class="page"><a href="###" class="first">首页</a><a href="###" class="prev">上一页</a><a href="###" class="goto on">1</a><a href="###" class="goto">2</a><a href="###" class="goto">3</a><a href="###" class="goto">4</a><a href="###" class="goto">5</a><a href="###" class="next">下一页</a><a href="###" class="last">末页</a>共' + self.rows.size().toString() + '个&nbsp;&nbsp;' + pagesize.toString() + '页</td></tr></tfoot>')
                        		.appendTo(self);
                var _gotoButton = pager.find("a.goto");
                var gotoPage = function (p) {
                    _gotoButton.removeClass("on");
                    if (pagesize < p) p = pagesize;
                    if (!p > 0) p = 1;
                    if (pagesize < 5 || p < 4) {
                        $.each(_gotoButton, function (i, dom) {
                            dom.innerHTML = 1 + i;
                            if (p == (1 + i)) {
                                $(dom).addClass("on");
                            }
                        })
                    } else if (p > pagesize - 2) {
                        $.each(_gotoButton, function (i, dom) {
                            dom.innerHTML = pagesize - 4 + i;
                            if (p == (pagesize - 4 + i)) {
                                $(dom).addClass("on");
                            }
                        })
                    } else {
                        $.each(_gotoButton, function (i, dom) {
                            dom.innerHTML = p - 2 + i;
                            if (i == 2) {
                                $(dom).addClass("on");
                            }
                        })
                    }
                    self.refresh();
                }
                self.refresh = function () {
                    var p = pager.find(".on").html()
                    self.rows.hide();
                    for (var i = showSize * (p - 1); i < self.rows.size() && i < showSize * p; i++) {
                        self.rows.eq(i).show();
                    }
                }

                pager.find("a.goto:gt(" + (pagesize - 1).toString() + ")").hide();
                pager.delegate(".goto", "click.widget", function (e) {
                    gotoPage($(this).html());
                }).delegate(".last", "click.widget", function (e) {
                    gotoPage(pagesize);
                }).delegate(".first", "click.widget", function (e) {
                    gotoPage(1);
                }).delegate(".next", "click.widget", function (e) {
                    gotoPage(parseInt(pager.find(".on").html()) + 1);
                }).delegate(".prev", "click.widget", function (e) {
                    gotoPage(parseInt(pager.find(".on").html()) - 1);
                })
                gotoPage(1);
            },
            initScroll: function () {
                var _height = parseInt(self.attr("fixheight")),
                        _rowHeight = self.find("tbody td").outerHeight(),
                        _headHeight = self.find("thead").outerHeight();
                if (_height >= self.outerHeight()) return;
                var showSize = Math.floor((_height - _headHeight) / _rowHeight);
                var _scrollBar = self.find("#superscrollor")[0] ?
								self.find("#superscrollor") : $("<div id='superscrollor' class='tableScrollBar'><div></div></div>");
                self.head.find("th").eq(-1).css({
                    "position": "relative",
                    "overflow": "show"
                }).append(_scrollBar);
                _scrollBar.css({
                    "position": "absolute",
                    "right": 0,
                    "top": _headHeight,
                    "height": _height - _headHeight,
                    "width": "18px",
                    "padding": "0",
                    "overflow-y": "scroll"
                });
                var _scroller = _scrollBar;
                var _scrollholder = _scrollBar.find("div").css({
                    "height": Math.ceil((_height - _headHeight) * self.rows.size() / showSize),
                    "display": "block",
                    "width": "1px"
                });
                var offsetStep = (_height - _headHeight - _scrollholder.height()) / (showSize - self.rows.size());
                var _offset = 0;
                self.refresh = function () {
                    self.rows.hide();
                    for (var i = 0; i < showSize; i++) {
                        self.rows.eq(i + _offset).show();
                    }
                }
                _scroller.scroll(function (evt) {
                    _offset = _scroller.scrollTop() / offsetStep;
                    self.refresh();
                })
                self.find("tr:gt(" + showSize.toString() + ")").hide();
            },
            initStyle: function () {
                $.createClass("");
                self.addClass("ibox_table")
            },
            init: function () {
                document.createElement()
                //self.initStyle();
                self.rows = self.find("tbody>tr:has(td)").show();
                self.head = self.find("thead>tr:has(th)");
                self.initSort();
                if (isNaN(parseInt(self.attr("pagesize"))) && !isNaN(parseInt(self.attr("fixheight")))) {
                    // no paging , add scroll bar
                    self.initScroll();
                } else if (!isNaN(parseInt(self.attr("pagesize")))) {
                    self.initPaging();
                }
            },
            initSort: function (json) {
                //▲▼△▽
                $.createClass("table tr th i{color:#aaa;font-style:normal;font-size:10px}table tr th i.active{color:black}");
                $.each(self.head.find('th'), function (i, d) {
                    var _fnSort = function (a, b) {
                        var va = (a.cells[i].innerHTML || a.cells[i].textContent)
                            , vb = (b.cells[i].innerHTML || b.cells[i].textContent)
                        if (isNaN(va) || isNaN(vb))
                            return va < vb ? 1 : -1
                        else
                            return Number(vb) - Number(va)
                    }, _fnSortInverse = function (a, b) {
                        return _fnSort(a, b) * -1
                    }
                    var th = $(d);
                    th.append("<i>▼</i>").bind('click', function (evt) {
                        if (!th.find("i").hasClass("active")) {
                            self.head.find("i.active").removeClass("active");
                            th.find("i").addClass("active"); //css("opacity", 1);
                            self.rows.detach().sort(_fnSort);
                        } else if (d.innerHTML.match(/▼/)) {
                            d.innerHTML = d.innerHTML.replace(/▼/, "▲");
                            self.rows.detach().sort(_fnSortInverse);
                        } else {
                            this.innerHTML = this.innerHTML.replace(/▲/, "▼");
                            self.rows.detach().sort(_fnSort);
                        }
                        self.append(self.rows);
                        self.refresh();
                    })
                })
            }
        });
        self.init();
    });
}
