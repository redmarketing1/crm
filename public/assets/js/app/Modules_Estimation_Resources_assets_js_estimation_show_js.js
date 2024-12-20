(self["webpackChunk"] = self["webpackChunk"] || []).push([["Modules_Estimation_Resources_assets_js_estimation_show_js"],{

/***/ "./Modules/Estimation/Resources/assets/js/estimation.show.js":
/*!*******************************************************************!*\
  !*** ./Modules/Estimation/Resources/assets/js/estimation.show.js ***!
  \*******************************************************************/
/***/ (() => {

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
Alpine.data('estimationShow', function () {
  return {
    items: {},
    comments: {},
    newItems: {},
    groups: {},
    totals: {},
    expandedRows: {},
    lastGroupNumber: 0,
    lastItemNumbers: {},
    searchQuery: '',
    selectAll: false,
    isFullScreen: false,
    autoSaveEnabled: true,
    contextMenu: {
      show: false,
      x: 0,
      y: 0,
      selectedRowId: null
    },
    columnVisibility: {
      column_pos: true,
      column_name: true,
      column_quantity: true,
      column_unit: true,
      column_optional: true,
      quote_th: true
    },
    init: function init() {
      var _this = this;
      this.initializeData();
      this.initializeSortable();
      this.initializeLastNumbers();
      this.initializeContextMenu();
      this.initializeColumnVisibility();
      this.initializeCardCalculations();
      this.$watch('items', function (value) {
        _this.calculateTotals();
        var cardQuoteIds = _toConsumableArray(new Set(Array.from(document.querySelectorAll('[data-cardquoteid]')).map(function (el) {
          return el.dataset.cardquoteid;
        })));
        cardQuoteIds.forEach(function (cardQuoteId) {
          return _this.calculateCardTotals(cardQuoteId);
        });
      }, {
        deep: true
      });
      this.$watch('autoSaveEnabled', function (newValue) {
        if (newValue) {
          _this.saveTableData();
        }
      });
      this.$watch('searchQuery', function () {
        return _this.filterTable();
      });
      this.$watch('selectAll', function (value) {
        return _this.checkboxAll(value);
      });
      document.addEventListener('click', function (e) {
        if (!e.target.closest('.context-menu')) {
          _this.showContextMenu = false;
        }
      });
      document.addEventListener('fullscreenchange', function () {
        _this.isFullScreen = !!document.fullscreenElement;
        var icon = document.querySelector('.fa-expand, .fa-compress');
        if (icon) {
          icon.className = _this.isFullScreen ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
        }
      });
      document.addEventListener('keydown', function (e) {
        if (e.target.classList.contains('item-quantity') || e.target.classList.contains('item-price')) {
          _this.handleInputBlur(e);
        }
      });
    },
    initializeFullScreen: function initializeFullScreen() {
      var _this2 = this;
      document.addEventListener('fullscreenchange', function () {
        _this2.isFullScreen = !!document.fullscreenElement;
        var btn = document.querySelector('.tools-btn button i.fa-expand, .tools-btn button i.fa-compress');
        if (btn) {
          btn.className = _this2.isFullScreen ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
        }
      });
    },
    toggleFullScreen: function toggleFullScreen() {
      var estimationSection = document.querySelector('.estimation-show');
      if (!estimationSection) return;
      if (!document.fullscreenElement) {
        estimationSection.requestFullscreen()["catch"](function (err) {
          console.error("Error attempting to enable fullscreen: ".concat(err.message));
        });
      } else {
        document.exitFullscreen();
      }
    },
    initializeData: function initializeData() {
      var _this3 = this;
      this.items = {};
      this.comments = {};
      this.groups = {};
      this.lastGroupNumber = 0;
      this.lastItemNumbers = {};
      document.querySelectorAll('tr.group_row').forEach(function (groupRow) {
        var groupId = groupRow.dataset.groupid;
        var groupPos = groupRow.querySelector('.grouppos').textContent.trim();
        var groupNumber = parseInt(groupPos);
        _this3.groups[groupId] = {
          id: groupId,
          pos: groupPos,
          name: groupRow.querySelector('.grouptitle-input').value,
          total: _this3.parseNumber(groupRow.querySelector('.text-right').textContent),
          itemCount: 0
        };
        _this3.lastGroupNumber = Math.max(_this3.lastGroupNumber, groupNumber);
      });
      document.querySelectorAll('tr.item_row').forEach(function (row) {
        var itemId = row.dataset.itemid;
        var groupId = row.dataset.groupid;
        _this3.items[itemId] = {
          id: itemId,
          type: 'item',
          groupId: groupId,
          pos: row.querySelector('.pos-inner').textContent.trim(),
          name: row.querySelector('.item-name').value,
          quantity: _this3.parseNumber(row.querySelector('.item-quantity').value),
          prices: _this3.updateItemPriceAndTotal(itemId),
          optional: row.querySelector('.item-optional').checked,
          unit: row.querySelector('.item-unit').value
        };
        _this3.groups[groupId].itemCount++;
      });
      document.querySelectorAll('tr.item_comment').forEach(function (row) {
        var itemId = row.dataset.commentid;
        var groupId = row.dataset.groupid;
        _this3.comments[itemId] = {
          id: itemId,
          type: 'comment',
          groupId: groupId,
          pos: row.querySelector('.pos-inner').textContent.trim(),
          content: row.querySelector('.column_name input').value,
          expanded: false
        };
        _this3.groups[groupId].itemCount++;
      });
      this.updatePOSNumbers();
      this.calculateTotals();
    },
    calculateItemTotal: function calculateItemTotal(itemId) {
      var priceColumnIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var item = this.items[itemId];
      if (!item || item.optional) return 0;
      var _item$prices$priceCol = item.prices[priceColumnIndex],
        singlePrice = _item$prices$priceCol.singlePrice,
        totalPrice = _item$prices$priceCol.totalPrice;
      var totalCell = document.querySelector("tr[data-itemid=\"".concat(itemId, "\"] .column_total_price[data-cardquoteid=\"").concat(priceColumnIndex, "\"]"));
      if (totalCell) {
        totalCell.textContent = this.formatCurrency(totalPrice);
        this.setNegativeStyle(totalCell, totalPrice);
      }
      return totalPrice;
    },
    calculateTotals: function calculateTotals() {
      var _this4 = this;
      this.totals = {};
      document.querySelectorAll('tr.group_row').forEach(function (row) {
        var groupId = row.dataset.groupid;
        if (!groupId) return;
        _this4.calculateGroupTotal(groupId);
        if (_this4.groups[groupId]) {
          var _row$querySelector;
          _this4.groups[groupId].total = _this4.parseNumber(((_row$querySelector = row.querySelector('.text-right.grouptotal')) === null || _row$querySelector === void 0 ? void 0 : _row$querySelector.textContent) || '0');
        }
      });
    },
    calculateGroupTotal: function calculateGroupTotal(groupId) {
      var _this5 = this;
      var totals = {};
      var groupRow = document.querySelector("tr.group_row[data-groupid=\"".concat(groupId, "\"]"));
      if (!groupRow) return 0;
      var currentRow = groupRow.nextElementSibling;
      var _loop = function _loop() {
        if (currentRow.classList.contains('item_row')) {
          var _currentRow$querySele;
          var itemId = currentRow.dataset.itemid;
          if (!((_currentRow$querySele = currentRow.querySelector('.item-optional')) !== null && _currentRow$querySele !== void 0 && _currentRow$querySele.checked)) {
            var _currentRow$querySele2;
            var quantity = _this5.parseNumber(((_currentRow$querySele2 = currentRow.querySelector('.item-quantity')) === null || _currentRow$querySele2 === void 0 ? void 0 : _currentRow$querySele2.value) || '0');
            var priceInputs = currentRow.querySelectorAll('.item-price');
            priceInputs.forEach(function (priceInput, index) {
              if (!totals[index]) totals[index] = 0;
              var price = _this5.parseNumber(priceInput.value || '0');
              totals[index] += quantity * price;
              var totalCell = currentRow.querySelectorAll('.column_total_price')[index];
              if (totalCell) {
                var total = quantity * price;
                totalCell.textContent = _this5.formatCurrency(total);
                _this5.setNegativeStyle(totalCell, total);
              }
            });
          } else {
            currentRow.querySelectorAll('.column_total_price').forEach(function (cell) {
              cell.textContent = '-';
              cell.style.backgroundColor = '';
              cell.style.color = '';
            });
          }
        }
        currentRow = currentRow.nextElementSibling;
      };
      while (currentRow && !currentRow.classList.contains('group_row')) {
        _loop();
      }
      var totalCells = groupRow.querySelectorAll('.text-right.grouptotal');
      totalCells.forEach(function (cell, index) {
        cell.textContent = _this5.formatCurrency(totals[index] || 0);
        _this5.setNegativeStyle(cell, totals[index] || 0);
        var cardQuoteId = cell.dataset.cardquoteid;
        if (cardQuoteId) {
          _this5.calculateCardTotals(cardQuoteId);
        }
      });
      return totals[0] || 0;
    },
    calculateCardTotals: function calculateCardTotals(cardQuoteId) {
      var _this6 = this;
      var subtotal = 0;
      var groupTotalCells = document.querySelectorAll("td[data-cardquoteid=\"".concat(cardQuoteId, "\"].grouptotal"));
      groupTotalCells.forEach(function (cell) {
        subtotal += _this6.parseNumber(cell.textContent);
      });
      var markupInput = document.querySelector("input[name=\"markup\"][value]:not([value=\"\"])[data-cardquoteid=\"".concat(cardQuoteId, "\"]"));
      var markup = this.parseNumber((markupInput === null || markupInput === void 0 ? void 0 : markupInput.value) || '0');
      var discountInput = document.querySelector("input[name=\"discount\"][data-cardquoteid=\"".concat(cardQuoteId, "\"]"));
      var cashDiscount = this.parseNumber((discountInput === null || discountInput === void 0 ? void 0 : discountInput.value) || '0');
      var vatSelect = document.querySelector("select[name=\"tax[]\"][data-cardquoteid=\"".concat(cardQuoteId, "\"]"));
      var vatRate = vatSelect ? this.parseNumber(vatSelect.value) / 100 : 0;
      var netAmount = subtotal + markup;
      var discountAmount = netAmount * cashDiscount / 100;
      var netWithDiscount = netAmount - discountAmount;
      var vatAmount = netWithDiscount * vatRate;
      var grossWithDiscount = netWithDiscount + vatAmount;
      this.updateCardTotalUI(cardQuoteId, {
        netAmount: netAmount,
        netWithDiscount: netWithDiscount,
        grossWithDiscount: grossWithDiscount,
        subtotal: subtotal
      });
    },
    updateCardTotalUI: function updateCardTotalUI(cardQuoteId, totals) {
      var netDiscountElement = document.querySelector("th[data-cardquoteid=\"".concat(cardQuoteId, "\"].total-net-discount"));
      if (netDiscountElement) {
        netDiscountElement.textContent = this.formatCurrency(totals.netWithDiscount);
      }
      var grossDiscountElement = document.querySelector("th[data-cardquoteid=\"".concat(cardQuoteId, "\"].total-gross-discount"));
      if (grossDiscountElement) {
        grossDiscountElement.textContent = this.formatCurrency(totals.grossWithDiscount);
      }
      var netElement = document.querySelector("th[data-cardquoteid=\"".concat(cardQuoteId, "\"].total-net"));
      if (netElement) {
        netElement.textContent = this.formatCurrency(totals.netAmount);
      }
      var grossElement = document.querySelector("th[data-cardquoteid=\"".concat(cardQuoteId, "\"] .total-gross-total"));
      if (grossElement) {
        grossElement.textContent = this.formatCurrency(totals.grossWithDiscount);
      }
    },
    initializeCardCalculations: function initializeCardCalculations() {
      var _this7 = this;
      var cardQuoteIds = _toConsumableArray(new Set(Array.from(document.querySelectorAll('[data-cardquoteid]')).map(function (el) {
        return el.dataset.cardquoteid;
      })));
      cardQuoteIds.forEach(function (cardQuoteId) {
        _this7.calculateCardTotals(cardQuoteId);
        var markupInput = document.querySelector("input[name=\"markup\"][data-cardquoteid=\"".concat(cardQuoteId, "\"]"));
        if (markupInput) {
          var value = _this7.parseNumber(markupInput.value);
          markupInput.value = _this7.formatDecimal(value);
          _this7.setNegativeStyle(markupInput, value);
        }
      });
      document.addEventListener('change', function (e) {
        var _target$closest;
        var target = e.target;
        var cardQuoteId = (_target$closest = target.closest('[data-cardquoteid]')) === null || _target$closest === void 0 ? void 0 : _target$closest.dataset.cardquoteid;
        if (!cardQuoteId) return;
        if (target.matches('input[name="markup"]')) {
          var markup = _this7.parseNumber(target.value || '0');
          target.value = _this7.formatDecimal(markup);
          _this7.setMarkupStyle(target, markup);
          var priceInputs = document.querySelectorAll("[data-cardquoteid=\"".concat(cardQuoteId, "\"] .item-price"));
          priceInputs.forEach(function (input) {
            var originalPrice = input.dataset.originalPrice ? _this7.parseNumber(input.dataset.originalPrice) : _this7.parseNumber(input.value);
            if (!input.dataset.originalPrice) {
              input.dataset.originalPrice = originalPrice;
            }
            var newPrice = _this7.parseNumber(input.dataset.originalPrice) + markup;
            input.value = _this7.formatCurrency(newPrice);
            var row = input.closest('tr');
            if (row) {
              var itemId = row.dataset.itemid;
              if (itemId) {
                _this7.calculateItemTotal(itemId);
              }
            }
          });
          _this7.calculateGroupTotal(_this7.lastGroupId);
          _this7.calculateTotals();
        }
        if (target.matches('input[name="markup"]') || target.matches('input[name="discount"]') || target.matches('select[name="tax[]"]') || target.matches('.item-price') || target.matches('.item-quantity') || target.matches('.item-optional')) {
          _this7.calculateCardTotals(cardQuoteId);
        }
      });
    },
    setMarkupStyle: function setMarkupStyle(input, value) {
      if (value < 0) {
        input.style.backgroundColor = 'rgb(255 240 240)';
        input.style.color = 'rgb(255 6 6)';
      } else {
        input.style.backgroundColor = '';
        input.style.color = '';
      }
    },
    setNegativeStyle: function setNegativeStyle(element, value) {
      if (value < 0) {
        element.style.backgroundColor = 'rgb(255 240 240)';
        element.style.color = 'rgb(255 6 6)';
      } else {
        element.style.backgroundColor = '';
        element.style.color = '';
      }
    },
    formatDecimal: function formatDecimal(value) {
      return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    },
    formatCurrency: function formatCurrency(value) {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
    },
    parseNumber: function parseNumber(value) {
      if (typeof value === 'number') return value;
      return parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
    },
    handleInputBlur: function handleInputBlur(event, type) {
      if (event.type === 'keydown') {
        if (event.key !== 'Enter') return;
        event.target.blur();
      }
      var value = event.target.value;
      var row = event.target.closest('tr');
      var itemId = row.dataset.itemid;
      switch (type) {
        case 'item':
          if (this.items[itemId]) {
            this.items[itemId].name = value;
          }
          break;
        case 'quantity':
          if (this.items[itemId]) {
            this.items[itemId].quantity = this.parseNumber(value);
            this.updateItemPriceAndTotal(itemId);
          }
          this.formatDecimalValue(event.target);
          break;
        case 'price':
          if (this.items[itemId]) {
            this.updateItemPriceAndTotal(itemId);
          }
          this.formatCurrencyValue(event.target);
          break;
        case 'unit':
          if (this.items[itemId]) {
            this.items[itemId].unit = value;
          }
          break;
        default:
          break;
      }
      this.calculateTotals();
    },
    updateItemPriceAndTotal: function updateItemPriceAndTotal(itemId) {
      var _this8 = this;
      var row = document.querySelector(".item_row[data-itemid=\"".concat(itemId, "\"]"));
      var singlePricing = row.querySelectorAll('.item-price');
      var prices = Array.from(singlePricing).map(function (element) {
        var quoteId = element.closest('td[data-cardquoteid]').dataset.cardquoteid;
        var singlePrice = _this8.parseNumber(element.value);
        var quantity = _this8.parseNumber(row.querySelector('.item-quantity').value);
        var total = singlePrice * quantity;
        return {
          id: quoteId,
          singlePrice: singlePrice,
          totalPrice: total
        };
      });
      if (this.items[itemId]) {
        this.items[itemId].prices = prices;
      }
      return prices;
    },
    formatDecimalValue: function formatDecimalValue(target) {
      target.value = this.formatDecimal(this.parseNumber(target.value));
    },
    formatCurrencyValue: function formatCurrencyValue(target) {
      target.value = this.formatCurrency(this.parseNumber(target.value));
    },
    handleOptionalChange: function handleOptionalChange(event, itemId) {
      if (this.items[itemId]) {
        this.items[itemId].optional = event.target.checked;
        if (this.newItems[itemId]) {
          this.newItems[itemId].optional = event.target.checked;
        }
        this.calculateTotals();
      }
    },
    filterTable: function filterTable() {
      var searchTerm = this.searchQuery.toLowerCase();
      Object.entries(this.items).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          itemId = _ref2[0],
          item = _ref2[1];
        var row = document.querySelector("tr[data-itemid=\"".concat(itemId, "\"]"));
        if (row) {
          row.style.display = item.name.toLowerCase().includes(searchTerm) || item.pos.toLowerCase().includes(searchTerm) ? '' : 'none';
        }
      });
      Object.entries(this.groups).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          groupId = _ref4[0],
          group = _ref4[1];
        var row = document.querySelector("tr[data-groupid=\"".concat(groupId, "\"]"));
        if (row) {
          row.style.display = group.name.toLowerCase().includes(searchTerm) || group.pos.toLowerCase().includes(searchTerm) ? '' : 'none';
        }
      });
      document.querySelectorAll('tr.item_comment').forEach(function (row) {
        var commentInput = row.querySelector('.item-description');
        var posElement = row.querySelector('.pos-inner');
        if (commentInput && posElement) {
          var commentText = commentInput.value.toLowerCase();
          var posText = posElement.textContent.toLowerCase();
          row.style.display = commentText.includes(searchTerm) || posText.includes(searchTerm) ? '' : 'none';
        }
      });
    },
    initializeSortable: function initializeSortable() {
      var _this9 = this;
      $("#estimation-edit-table").sortable({
        items: 'tbody tr',
        cursor: 'pointer',
        axis: 'y',
        dropOnEmpty: true,
        handle: '.fa-bars, .fa-up-down',
        animation: 150,
        start: function start(e, ui) {
          ui.item.addClass("selected");
        },
        stop: function stop(event, ui) {
          var movedRow = ui.item[0];
          if (movedRow.classList.contains('item_row') || movedRow.classList.contains('item_comment')) {
            var currentRow = movedRow.previousElementSibling;
            var newGroupRow = null;
            while (currentRow && !newGroupRow) {
              if (currentRow.classList.contains('group_row')) {
                newGroupRow = currentRow;
              }
              currentRow = currentRow.previousElementSibling;
            }
            if (newGroupRow) {
              var newGroupId = newGroupRow.dataset.groupid;
              var itemId = movedRow.dataset.itemid || movedRow.dataset.id;
              var oldGroupId = movedRow.dataset.groupid;
              movedRow.dataset.groupid = newGroupId;
              if (_this9.items[itemId]) {
                _this9.items[itemId].groupId = newGroupId;
              }
              if (_this9.newItems[itemId]) {
                _this9.newItems[itemId].groupId = newGroupId;
              }
            }
          }
          _this9.updatePOSNumbers();
          _this9.calculateTotals();
        }
      });
    },
    initializeLastNumbers: function initializeLastNumbers() {
      var _this10 = this;
      var posNumbers = new Set();
      document.querySelectorAll('.pos-inner').forEach(function (element) {
        var pos = element.textContent.trim();
        if (pos) {
          posNumbers.add(pos);
          var _pos$split = pos.split('.'),
            _pos$split2 = _slicedToArray(_pos$split, 2),
            groupNum = _pos$split2[0],
            itemNum = _pos$split2[1];
          var groupNumber = parseInt(groupNum);
          var itemNumber = parseInt(itemNum);
          _this10.lastGroupNumber = Math.max(_this10.lastGroupNumber, groupNumber);
          if (!_this10.lastItemNumbers[groupNumber] || itemNumber > _this10.lastItemNumbers[groupNumber]) {
            _this10.lastItemNumbers[groupNumber] = Math.min(itemNumber, 99);
          }
        }
      });
      document.querySelectorAll('.grouppos').forEach(function (element) {
        var groupNum = parseInt(element.textContent.trim());
        _this10.lastGroupNumber = Math.max(_this10.lastGroupNumber, groupNum);
      });
    },
    addItem: function addItem(type) {
      var _this11 = this;
      var targetRowId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var timestamp = Date.now();
      var currentGroupId;

      // Check if table is completely empty
      var hasAnyGroups = document.querySelectorAll('tr.group_row').length > 0;

      // If table is empty, always create a group first with an item
      if (!hasAnyGroups) {
        // Create group
        var groupTimestamp = Date.now();
        currentGroupId = "group_".concat(groupTimestamp);
        var newGroup = {
          id: groupTimestamp,
          type: 'group',
          name: 'New Group',
          total: 0,
          expanded: false,
          pos: ''
        };

        // Add group to collections
        this.items[groupTimestamp] = newGroup;
        this.newItems[groupTimestamp] = newGroup;
        this.groups[currentGroupId] = {
          id: currentGroupId,
          pos: '',
          name: 'New Group',
          total: 0,
          itemCount: 0
        };

        // Create child item
        var itemTimestamp = Date.now() + 1;
        var _newItem = {
          id: itemTimestamp,
          type: 'item',
          groupId: currentGroupId,
          name: 'New Item',
          quantity: 0,
          price: 0,
          unit: '',
          optional: false,
          expanded: false,
          pos: ''
        };

        // Add item to collections
        this.items[itemTimestamp] = _newItem;
        this.newItems[itemTimestamp] = _newItem;
        this.$nextTick(function () {
          _this11.initializeSortable();
          _this11.updatePOSNumbers();
          _this11.calculateTotals();
        });
        return;
      }

      // Normal flow for non-empty table
      if (type === 'group') {
        currentGroupId = "group_".concat(timestamp);
        var _newItem2 = {
          id: timestamp,
          type: 'group',
          name: "Group name",
          total: 0,
          expanded: false,
          pos: ''
        };
        this.items[timestamp] = _newItem2;
        this.newItems[timestamp] = _newItem2;
        this.groups[currentGroupId] = {
          id: currentGroupId,
          pos: '',
          name: 'Group name',
          total: 0,
          itemCount: 0
        };
        this.$nextTick(function () {
          _this11.initializeSortable();
          _this11.updatePOSNumbers();
          _this11.calculateTotals();
        });
        return;
      }

      // For items and comments in non-empty table
      if (targetRowId) {
        var targetRow = document.querySelector("tr[data-id=\"".concat(targetRowId, "\"], \n                                               tr[data-itemid=\"").concat(targetRowId, "\"], \n                                               tr[data-commentid=\"").concat(targetRowId, "\"], \n                                               tr[data-groupid=\"").concat(targetRowId, "\"]"));
        if (targetRow) {
          currentGroupId = targetRow.classList.contains('group_row') ? targetRow.dataset.groupid : targetRow.dataset.groupid;
        }
      } else {
        var GroupRow = document.querySelectorAll('tr.group_row');
        var lastGroupRow = GroupRow[GroupRow.length - 1];
        currentGroupId = lastGroupRow ? lastGroupRow.dataset.groupid : null;
      }
      var newItem = {
        id: timestamp,
        type: type,
        groupId: currentGroupId,
        name: type + " name",
        quantity: 0,
        price: 0,
        unit: '',
        optional: false,
        expanded: false,
        pos: ''
      };
      this.items[timestamp] = newItem;
      this.newItems[timestamp] = newItem;
      this.$nextTick(function () {
        if (targetRowId) {
          var _targetRow = document.querySelector("tr[data-id=\"".concat(targetRowId, "\"], \n                                                   tr[data-itemid=\"").concat(targetRowId, "\"], \n                                                   tr[data-commentid=\"").concat(targetRowId, "\"], \n                                                   tr[data-groupid=\"").concat(targetRowId, "\"]"));
          var newRow = document.querySelector("tr[data-id=\"".concat(timestamp, "\"], \n                                                tr[data-itemid=\"").concat(timestamp, "\"]"));
          if (newRow && _targetRow.nextSibling) {
            _targetRow.parentNode.insertBefore(newRow, _targetRow.nextSibling);
          }
        }
        _this11.initializeSortable();
        _this11.updatePOSNumbers();
        _this11.calculateTotals();
      });
      if (targetRowId) {
        this.contextMenu.show = false;
      }
    },
    removeItem: function removeItem() {
      var _this12 = this;
      var selectedCheckboxes = document.querySelectorAll('.item_selection:checked');
      if (selectedCheckboxes.length === 0) {
        toastrs("Error", "Please select checkbox to continue delete");
        return;
      }
      Swal.fire({
        title: 'Confirmation Delete',
        text: 'Really! You want to remove them? You can\'t undo',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete it',
        cancelButtonText: "No, cancel"
      }).then(function (result) {
        if (result.isConfirmed) {
          var itemIds = [];
          var groupIds = [];
          selectedCheckboxes.forEach(function (checkbox) {
            var row = checkbox.closest('tr');
            if (row.classList.contains('group_row')) {
              groupIds.push(row.dataset.groupid);
              delete _this12.groups[row.dataset.groupid];
            } else {
              itemIds.push(row.dataset.itemid);
              delete _this12.items[row.dataset.itemid];
            }
            row.remove();
          });
          document.querySelector('.SelectAllCheckbox').checked = false;
          fetch(route('estimations.remove_items.estimate'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({
              estimation_id: window.estimation_id,
              item_ids: itemIds,
              group_ids: groupIds
            })
          });
          _this12.calculateTotals();
          _this12.updatePOSNumbers();
        }
      });
    },
    updatePOSNumbers: function updatePOSNumbers() {
      var _this13 = this;
      var currentGroupPos = 0;
      var itemCountInGroup = 0;
      var lastGroupId = null;
      document.querySelectorAll('tr').forEach(function (row) {
        if (row.classList.contains('group_row')) {
          currentGroupPos++;
          itemCountInGroup = 0;
          lastGroupId = row.dataset.groupid;
          var groupPos = currentGroupPos.toString().padStart(2, '0');
          row.querySelector('.grouppos').textContent = "".concat(groupPos);
          if (_this13.groups[lastGroupId]) {
            _this13.groups[lastGroupId].pos = groupPos;
          }
        } else if (row.classList.contains('item_row') || row.classList.contains('item_comment')) {
          itemCountInGroup++;
          var itemPos = "".concat(currentGroupPos.toString().padStart(2, '0'), ".").concat(itemCountInGroup.toString().padStart(2, '0'));
          row.querySelector('.pos-inner').textContent = itemPos;
          var itemId = row.dataset.itemid || row.dataset.commentid;
          if (_this13.items[itemId]) {
            _this13.items[itemId].pos = itemPos;
          }
        }
      });
    },
    duplicateCardColumn: function duplicateCardColumn(quoteId) {
      alert('Action for duplicateCardColumn' + quoteId);
    },
    deleteCardColumn: function deleteCardColumn(quoteId) {
      var _this14 = this;
      Swal.fire({
        title: 'Confirmation Delete',
        text: 'Really! You want to remove this column? You can\'t undo',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete it',
        cancelButtonText: "No, cancel",
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-secondary'
        }
      }).then(function (result) {
        if (result.isConfirmed) {
          try {
            var elements = document.querySelectorAll("[data-cardquoteid=\"".concat(quoteId, "\"]"));
            elements.forEach(function (el) {
              return el.remove();
            });
            _this14.calculateTotals();
            Swal.fire({
              title: 'Deleted!',
              text: "The Column has been deleted successfully",
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });

            // If using an API, make the delete request
            // fetch(route('estimations.delete_column'), {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            //     },
            //     body: JSON.stringify({
            //         estimation_id: window.estimation_id,
            //         quote_id: quoteId
            //     })
            // }).catch(error => {
            //     console.error('Error deleting column:', error);
            // });
          } catch (error) {
            console.error('Error deleting column:', error);
            Swal.fire({
              title: 'Error!',
              text: 'An error occurred while deleting the column',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      });
    },
    toggleDescription: function toggleDescription(index, event) {
      event.stopPropagation();
      if (!this.expandedRows) {
        this.expandedRows = {};
      }
      this.expandedRows[index] = !this.expandedRows[index];
      var parentRow = event.target.closest('tr');
      var childRow = document.querySelector("tr.item_child[data-id=\"".concat(index, "\"]"));
      if (childRow) {
        childRow.style.display = this.expandedRows[index] ? 'table-row' : 'none';
        var icon = parentRow.querySelector('.desc_toggle');
        if (icon) {
          icon.classList.toggle('fa-caret-right');
          icon.classList.toggle('fa-caret-down');
        }
      }
    },
    isExpanded: function isExpanded(index) {
      return this.expandedRows[index] || false;
    },
    initializeContextMenu: function initializeContextMenu() {
      var _this15 = this;
      document.querySelector('#estimation-edit-table').addEventListener('contextmenu', function (e) {
        var row = e.target.closest('tr.item_row, tr.group_row, tr.item_comment');
        if (!row) return;
        e.preventDefault();
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;
        var x = e.clientX;
        var y = e.clientY;
        if (x + 160 > viewportWidth) x = viewportWidth - 160;
        if (y + 160 > viewportHeight) y = viewportHeight - 160;
        _this15.contextMenu = {
          show: true,
          x: x,
          y: y,
          selectedRowId: row.dataset.id || row.dataset.itemid || row.dataset.commentid || row.dataset.groupid
        };
      });
    },
    moveRow: function moveRow(direction, rowId) {
      var row = document.querySelector("tr[data-id=\"".concat(rowId, "\"], \n                                         tr[data-itemid=\"").concat(rowId, "\"], \n                                         tr[data-commentid=\"").concat(rowId, "\"], \n                                         tr[data-groupid=\"").concat(rowId, "\"]"));
      if (!row) return;
      if (direction === 'up') {
        var prevRow = row.previousElementSibling;
        if (prevRow) {
          row.parentNode.insertBefore(row, prevRow);
        }
      } else {
        var nextRow = row.nextElementSibling;
        if (nextRow) {
          row.parentNode.insertBefore(nextRow, row);
        }
      }
      this.updatePOSNumbers();
      this.calculateTotals();
      this.contextMenu.show = false;
    },
    duplicateRow: function duplicateRow(rowId) {
      var _this16 = this;
      var originalRow = document.querySelector("tr[data-id=\"".concat(rowId, "\"], \n                                                 tr[data-itemid=\"").concat(rowId, "\"], \n                                                 tr[data-commentid=\"").concat(rowId, "\"], \n                                                 tr[data-groupid=\"").concat(rowId, "\"]"));
      if (!originalRow) return;
      var timestamp = Date.now();
      var isGroup = originalRow.classList.contains('group_row');
      var isComment = originalRow.classList.contains('item_comment');
      var groupId = isGroup ? null : originalRow.dataset.groupid;
      if (isGroup) {
        var groupName = originalRow.querySelector('.grouptitle-input').value;
        var newGroupId = "group_".concat(timestamp);
        var newItem = {
          id: timestamp,
          type: 'group',
          name: "".concat(groupName, " - copy"),
          total: 0,
          expanded: false
        };
        this.items[timestamp] = newItem;
        this.newItems[timestamp] = newItem;
        this.groups[newGroupId] = {
          id: newGroupId,
          pos: '',
          name: "".concat(groupName, " - copy"),
          total: 0,
          itemCount: 0
        };
      } else if (isComment) {
        var _newItem3 = {
          id: timestamp,
          type: 'comment',
          groupId: groupId,
          content: originalRow.querySelector('.item-description').value,
          expanded: false
        };
        this.items[timestamp] = _newItem3;
        this.newItems[timestamp] = _newItem3;
      } else {
        var _originalRow$querySel, _originalRow$querySel2, _originalRow$querySel3, _originalRow$querySel4, _originalRow$querySel5;
        var _newItem4 = {
          id: timestamp,
          type: originalRow.classList.contains('item_comment') ? 'comment' : 'item',
          groupId: groupId,
          name: ((_originalRow$querySel = originalRow.querySelector('.item-name')) === null || _originalRow$querySel === void 0 ? void 0 : _originalRow$querySel.value) + ' - copy',
          quantity: this.parseNumber(((_originalRow$querySel2 = originalRow.querySelector('.item-quantity')) === null || _originalRow$querySel2 === void 0 ? void 0 : _originalRow$querySel2.value) || '0'),
          unit: ((_originalRow$querySel3 = originalRow.querySelector('.item-unit')) === null || _originalRow$querySel3 === void 0 ? void 0 : _originalRow$querySel3.value) || '',
          optional: ((_originalRow$querySel4 = originalRow.querySelector('.item-optional')) === null || _originalRow$querySel4 === void 0 ? void 0 : _originalRow$querySel4.checked) || false,
          price: this.parseNumber(((_originalRow$querySel5 = originalRow.querySelector('.item-price')) === null || _originalRow$querySel5 === void 0 ? void 0 : _originalRow$querySel5.value) || '0'),
          expanded: false
        };
        this.items[timestamp] = _newItem4;
        this.newItems[timestamp] = _newItem4;
        if (this.groups[groupId]) {
          this.groups[groupId].itemCount++;
        }
      }
      this.$nextTick(function () {
        var newRow = document.querySelector("tr[data-id=\"".concat(timestamp, "\"], tr[data-itemid=\"").concat(timestamp, "\"], tr[data-commentid=\"").concat(timestamp, "\"]"));
        if (newRow && originalRow.nextSibling) {
          originalRow.parentNode.insertBefore(newRow, originalRow.nextSibling);
        }
        _this16.updatePOSNumbers();
        _this16.calculateTotals();
        _this16.initializeContextMenu();
      });
      this.contextMenu.show = false;
    },
    removeRowFromMenu: function removeRowFromMenu(rowId) {
      var _this17 = this;
      Swal.fire({
        title: 'Confirmation Delete',
        text: 'Really! You want to remove this item? You can\'t undo',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete it',
        cancelButtonText: "No, cancel"
      }).then(function (result) {
        if (result.isConfirmed) {
          var row = document.querySelector("tr[data-id=\"".concat(rowId, "\"], tr[data-itemid=\"").concat(rowId, "\"], tr[data-groupid=\"").concat(rowId, "\"]"));
          if (!row) return;
          if (row.classList.contains('group_row')) {
            var groupId = row.dataset.groupid;
            document.querySelectorAll("tr[data-groupid=\"".concat(groupId, "\"]")).forEach(function (itemRow) {
              var itemId = itemRow.dataset.itemid;
              delete _this17.items[itemId];
              delete _this17.newItems[itemId];
              itemRow.remove();
            });
            delete _this17.groups[groupId];
          } else {
            var itemId = row.dataset.itemid || row.dataset.id;
            delete _this17.items[itemId];
            delete _this17.newItems[itemId];
          }
          row.remove();
          _this17.updatePOSNumbers();
          _this17.calculateTotals();
          document.querySelector('.SelectAllCheckbox').checked = false;
        }
      });
      this.contextMenu.show = false;
    },
    handleGroupSelection: function handleGroupSelection(event, groupId) {
      var checked = event.target.checked;
      var groupRow = event.target.closest('tr.group_row');
      if (!groupRow) return;
      var currentRow = groupRow.nextElementSibling;
      while (currentRow && !currentRow.classList.contains('group_row')) {
        var checkbox = currentRow.querySelector('.item_selection');
        if (checkbox) {
          checkbox.checked = checked;
        }
        currentRow = currentRow.nextElementSibling;
      }
    },
    checkboxAll: function checkboxAll(value) {
      document.querySelectorAll('.item_selection').forEach(function (checkbox) {
        checkbox.checked = value;
      });
    },
    initializeColumnVisibility: function initializeColumnVisibility() {
      var _this18 = this;
      document.querySelectorAll('.column-toggle').forEach(function (checkbox) {
        checkbox.addEventListener('change', function (e) {
          var columnClass = e.target.dataset.column;
          var quoteId = e.target.dataset.quoteid;
          if (columnClass === 'quote_th' && quoteId) {
            _this18.columnVisibility[columnClass] = e.target.checked;
            _this18.applyColumnVisibility(quoteId);
          } else {
            _this18.columnVisibility[columnClass] = e.target.checked;
            _this18.applyColumnVisibility();
          }
        });
      });
    },
    applyColumnVisibility: function applyColumnVisibility() {
      var quoteId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      Object.entries(this.columnVisibility).forEach(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
          columnClass = _ref6[0],
          isVisible = _ref6[1];
        if (columnClass === 'quote_th' && quoteId) {
          var elements = document.querySelectorAll(".quote_th".concat(quoteId, ", ") + "[data-cardquoteid=\"".concat(quoteId, "\"]"));
          console.log(elements);
          elements.forEach(function (el) {
            el.style.display = isVisible ? '' : 'none';
          });
        } else {
          var _elements = document.querySelectorAll(".".concat(columnClass));
          _elements.forEach(function (el) {
            if (el.closest('td, th')) {
              el.closest('td, th').style.display = isVisible ? '' : 'none';
            }
          });
        }
      });
    },
    toggleColumn: function toggleColumn(columnClass) {
      var quoteId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.columnVisibility[columnClass] = !this.columnVisibility[columnClass];
      this.applyColumnVisibility(quoteId);
      var selector = quoteId ? ".column-toggle[data-column=\"".concat(columnClass, "\"][data-quote=\"").concat(quoteId, "\"]") : ".column-toggle[data-column=\"".concat(columnClass, "\"]");
      var checkbox = document.querySelector(selector);
      if (checkbox) {
        checkbox.checked = this.columnVisibility[columnClass];
      }
    },
    saveTableData: function saveTableData() {
      // Prepare the data to be sent to the server
      var data = {
        form: this.getFomrData(),
        item: this.serializeEstimationData(),
        group: this.groups
      };
      console.log(data);
      $.ajax({
        url: route('estimation.update', 11),
        method: 'PUT',
        data: data,
        beforeSend: function beforeSend() {
          //TODO:
        },
        success: function success(data) {
          console.log(data);
        }
      });

      // Send the data to the server using an AJAX request
      // fetch('/estimations/save', {
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'application/json',
      //         'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      //     },
      //     body: JSON.stringify(data),
      // })
      //     .then((response) => response.json())
      //     .then((data) => {
      //         // Handle the response from the server
      //         console.log('Estimation saved:', data);
      //     })
      //     .catch((error) => {
      //         // Handle any errors
      //         console.error('Error saving estimation:', error);
      //     });
    },
    getFomrData: function getFomrData() {
      var formData = new FormData(this.$el.closest('form'));
      return Object.fromEntries(formData);
    },
    serializeEstimationData: function serializeEstimationData() {
      // return JSON.stringify(this.items);
      return Object.values(this.items);
    }
  };
});

/***/ })

}]);