$(document).ready(function () {

    function loadDataTables() {
        let table = $('#projectsTable').DataTable({
            pageLength: 50,
            lengthMenu: [[25, 50, 100, 200], [25, 50, 100, 200]],
            lengthChange: true,
            ordering: false,
            searching: true,
            ordering: false,
            layout: {
                topEnd: null
            },
            select: {
                style: 'multi'
            },
            pagingType: 'simple',
            language: {
                paginate: {
                    previous: 'Previous',
                    next: 'Next'
                }
            },
            processing: false,
            serverSide: false,
            ajax: {
                url: route('project.index'),
                type: 'GET',
                dataType: 'json',
            },
            columns: [
                {
                    data: null,
                    orderable: false,
                    className: 'dt-body-center input-checkbox',
                    render: function (data, type, full, meta) {
                        return '<input type="checkbox" class="row-select-checkbox" value="' + data.id + '">';
                    }
                },
                {
                    data: 'thumbnail',
                    name: 'thumbnail',
                    className: 'thumbnail',
                    render: function (url) {
                        return `<div class="data-thubmnail"><img src="${url}"></div>`;
                    }
                },
                {
                    data: 'status_data',
                    visible: false,
                    name: 'status',
                    className: 'status',
                    render: function (data) {
                        if (data && data.name) {

                            let backgroundColor = data.background_color || '#ffffff';
                            let fontColor = data.font_color || '#555555';

                            return `<span class="data-project-status" style="background-color: ${backgroundColor}; color: ${fontColor};">${data.name}</span>`;
                        } else {
                            return `<span class="no-data">-</span>`;
                        }
                    }
                },
                { data: 'name', name: 'name', orderable: true, className: 'name' },
                { data: 'comments', name: 'comments', orderable: false, className: 'comments' },
                { data: 'is_archive', name: 'is_archive', visible: false, className: 'is_archive' },
                {
                    data: 'priority_data',
                    name: 'priority',
                    orderable: false,
                    className: 'priority',
                    render: function (data) {
                        if (data && data.name) {

                            let backgroundColor = data.background_color || '#ffffff';
                            let fontColor = data.font_color || '#555555';

                            return `<span class="data-project-priority" style="background-color: ${backgroundColor}; color: ${fontColor};">${data.name}</span>`;
                        } else {
                            return `<span class="no-data">-</span>`;
                        }

                    }
                },
                { data: 'construction', name: 'construction', orderable: false, className: 'construction' },
                {
                    data: 'budget',
                    name: 'budget',
                    orderable: true,
                    className: 'budget',
                    createdCell: function (td, cellData, rowData, row, col) {
                        const isZero = parseInt(cellData);
                        if (isZero == 0) {
                            $(td).addClass('zero');
                        }
                    }
                },
                { data: 'created_at', name: 'created_at', orderable: true, className: 'created_at' },
                { data: 'action', name: 'action', orderable: false, searchable: false, className: 'action' }
            ],
            rowCallback: function (row, data, index) {
                if (data.is_archive) {
                    $(row).addClass('is_archive');
                } else {
                    $(row).addClass('is_active');
                }
            },
            initComplete: function (settings, { data, filterableStatusList, filterablePriorityList, minBudget, maxBudget }) {

                $('#projectsTable colgroup').remove();

                if (filterableStatusList.html) {
                    var htmlContent = $.parseHTML(filterableStatusList.html);
                    $('#projectsTable')
                        .parents('.projectsTableContainter')
                        .parents('div.col-xl-12')
                        .before(htmlContent)
                }

                if (filterableStatusList.data) {
                    const selectData = $.map(filterableStatusList.data, function (value, key) {
                        return {
                            id: removeWhitespace(value.name).toLowerCase(),
                            text: value.name,
                            backgroundColor: value.background_color,
                            fontColor: value.font_color
                        };
                    });

                    /** 
                        $('#filterableStatusDropdown').select2({
                            data: selectData,
                            placeholder: 'Select Status',
                            multiple: true,
                            allowClear: false,
                            minimumResultsForSearch: Infinity,
                            templateResult: formatOption,
                            templateSelection: formatSelection
                        });
                    */
                }

                if (filterablePriorityList) {
                    const selectData = $.map(filterablePriorityList, function (value, key) {
                        return {
                            id: value.name,
                            text: value.name,
                            backgroundColor: value.background_color,
                            fontColor: value.font_color
                        };
                    });

                    $('#filterablePriorityDropdown').select2({
                        data: selectData,
                        placeholder: 'Select Priority',
                        multiple: true,
                        allowClear: false,
                        minimumResultsForSearch: Infinity,
                        templateResult: formatOption,
                        templateSelection: formatSelection
                    });
                }

                $('#projectsTable tr:first-child.hide').fadeIn();

                $('.daterange').daterangepicker({
                    autoUpdateInput: false,
                    locale: {
                        cancelLabel: 'clear'
                    },
                    ranges: {
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        'This Week': [moment().subtract(6, 'days'), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment()
                            .subtract(1, 'month').endOf('month')
                        ]
                    }
                }).on('apply.daterangepicker', function (ev, picker) {
                    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
                    table.draw();
                }).on('cancel.daterangepicker', function (ev, picker) {
                    $(this).val('');
                    table.draw();
                });

                $('#projectsTable thead tr:nth-child(2) th:first-child').html('<input type="checkbox" id="select-all">');

                $('#projectsTable tbody').on('change', '.row-select-checkbox', function () {
                    var selectedRows = $('input.row-select-checkbox:checked').length;
                    if (selectedRows > 0) {
                        $('#bulk-action-selector').fadeIn();
                    } else {
                        $('#bulk-action-selector').fadeOut();
                    }
                });

                $('#select-all').on('change', function () {
                    var isChecked = this.checked;
                    $('input.row-select-checkbox').prop('checked', isChecked);

                    var selectedRows = $('input.row-select-checkbox:checked').length;
                    if (selectedRows > 0) {
                        $('#bulk-action-selector').fadeIn();
                    } else {
                        $('#bulk-action-selector').fadeOut();
                    }
                });

                $('.projects-filters .select2').select2({
                    minimumResultsForSearch: Infinity
                });


                $('#filter_price_from,#filter_price_to').attr('max', removeSymbol(maxBudget));
                $('#filter_price_to,.range-max').val(
                    removeSymbol(maxBudget)
                );
            }
        });

        // Custom format for dropdown options
        function formatOption(option) {
            if (!option.id) {
                return option.text;
            }
            return $('<span>').css({
                'background-color': option.backgroundColor,
                'color': option.fontColor,
                'padding': '5px',
                'border-radius': '4px',
                'display': 'block'
            }).text(option.text);
        }

        // Custom format for selected option
        function formatSelection(option) {
            if (!option.id) {
                return option.text;
            }
            return $('<span>').css({
                'background-color': option.backgroundColor,
                'color': option.fontColor,
                'padding': '5px',
                'border-radius': '4px',
                'display': 'block'
            }).text(option.text);
        }

        $(document).on('click', '#status-tabs a', function (e) {
            e.preventDefault();
            $('#status-tabs a').removeClass('active');
            $(this).addClass('active');
            table.draw();
        });

        $(document).on('input', '#searchProject, #filter_price_from, #filter_price_to', debounce(function (e) {
            table.draw();
        }, 500));

        $(document).on('change', '#filterableStatusDropdown, #filterablePriorityDropdown, #filterableDaterange, #projectVisibality', function () {
            table.draw();
        });

        var isVisible = false;
        $(document).on('click', '#projectContactDetailsToggle', function (e) {
            e.preventDefault();
            isVisible = !isVisible;
            table.rows().every(function () {
                var rowNode = this.node();
                if (isVisible) {
                    $(rowNode).find('.data-sub-name').fadeIn(600);
                } else {
                    $(rowNode).find('.data-sub-name').fadeOut(600);
                }
            });
            table.draw();
        });

        function handleBulkAction(type, title, text, selectedData, selectedRows, selectedType) {
            Swal.fire({
                title: title,
                text: text,
                showCancelButton: true,
                confirmButtonText: `Yes, ${type} it`,
                cancelButtonText: "No, cancel",
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: route('project.update', 1),
                        type: "PUT",
                        data: { type: type, ids: selectedData },
                        success: function (response) {
                            console.log(response);
                        }
                    });

                    let current = 1;
                    const total = selectedData.length;
                    let timerInterval;
                    Swal.fire({
                        icon: 'success',
                        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Successful!`,
                        html: `<b>${current}</b> project${total > 1 ? 's' : ''} have been moved to ${type}`,
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        didOpen: () => {
                            Swal.showLoading();
                            const b = Swal.getHtmlContainer().querySelector('b');
                            timerInterval = setInterval(() => {
                                if (current < total) {
                                    current++;
                                    b.textContent = `${current}`;
                                } else {
                                    clearInterval(timerInterval);
                                }
                            }, 100);
                        },
                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                    }).then(function () {
                        if (type === 'delete') {
                            selectedRows.each(function () {
                                var row = $(this).val();
                                $(row).remove();
                                table.row(row).remove();
                            });
                        }

                        if (type === 'archive' || type === 'unarchive') {
                            selectedRows.each(function () {
                                const rowId = $(this).val();
                                const rowData = table.row('#' + rowId).data();
                                rowData.is_archive = type === 'archive' ? 1 : 0;
                                table.row('#' + rowId).data(rowData).draw();
                            });
                        }

                        if (type === 'duplicate') {
                            selectedRows.each(function () {
                                const rowId = $(this).val();
                                const rowData = table.row('#' + rowId).data();
                                table.row.add(rowData).draw();
                            });
                        }

                        if (selectedType === 'select') {
                            $('input#select-all,.row-select-checkbox').prop('checked', false);
                            $('#bulk-action-selector').val('bulk').fadeOut();
                        }
                    });
                }
            });
        }

        $(document).on('change', '#bulk-action-selector', function () {
            const selectedOption = $(this).find('option:selected');
            const value = selectedOption.val();
            if (!value || value === "Bulk actions") {
                return;
            }

            const title = selectedOption.data('title');
            const text = selectedOption.data('text');
            const type = selectedOption.data('type');
            const selectedRows = $('input.row-select-checkbox:checked');
            const selectedData = [];

            selectedRows.each(function () {
                selectedData.push($(this).val());
            });

            handleBulkAction(type, title, text, selectedData, selectedRows, 'select');
        });

        // Handle button click (e.g., delete button)
        $(document).on('click', '.action-btn button', function (e) {
            e.preventDefault();
            const button = $(this);

            const id = $(this).val();
            const type = button.data('type');
            const title = button.data('title');
            const text = button.data('text');

            const selectedRows = button;
            const selectedData = [id];

            handleBulkAction(type, title, text, selectedData, selectedRows, 'click');
        });

        $(document).on('click', '#clearFilter', function () {
            $('input#select-all,.row-select-checkbox').prop('checked', false);
            $('#bulk-action-selector').val('bulk');
            $('#status-tabs a').removeClass('active');
            $('#searchProject,#filterableStatusDropdown,#filterablePriorityDropdown,#filterableDaterange').val(null).trigger('change');
            $('#filter_price_from').val(0);
            $('#filter_price_to,.range-max').val($('#filter_price_to').attr('max'));
            table.draw();
        });

        function findByTabStatus(data) {
            const activeTabs = $('#status-tabs .active');
            let projectStatus = removeWhitespace(data[2] || '').toLowerCase();
            projectStatus = removeSelectedWords(projectStatus);

            const searchProject = removeWhitespace($('#searchProject').val()).toLowerCase();
            if (searchProject.length > 0) {
                return true;
            }

            if (activeTabs.length === 0) {
                $('#status-tabs a').removeClass('active');
                $('#status-tabs a').first().addClass('active');
                return true;
            }

            const selectedStatus = removeWhitespace(activeTabs.map(function () {
                return $(this).data('status-name');
            }).get().join(' ')).toLowerCase();

            if (selectedStatus === '' || selectedStatus === 'all') return true;

            /** Disable multiple tab selector
            if (activeTabs.length > 1) {
                $('#status-tabs a').first().removeClass('active');
                return selectedStatus.includes(projectStatus)
            }*/

            return selectedStatus === projectStatus;
        }

        function projectVisibility(data) {

            const selectedVisibility = $('#projectVisibality').val() || 'only-active';
            const isArchived = parseInt(data[5], 10);

            if (selectedVisibility === 'only-archive') {
                $('#status-tabs').find('a').fadeOut().removeClass('active');
                $('#bulk-action-selector').find('option[value=archive]').hide();
                $('#bulk-action-selector').find('option[value=unarchive]').show();
            } else {
                $('#status-tabs').find('a').fadeIn();
                $('#bulk-action-selector').find('option[value=archive]').show();
                $('#bulk-action-selector').find('option[value=unarchive]').hide();
            }

            if ((selectedVisibility === 'only-active' && isArchived === 1) ||
                (selectedVisibility === 'only-archive' && isArchived === 0)) {
                return false;
            } else {
                return true;
            }
        }

        function findByMultipleStatus(data) {
            /** Don't remove will do later */
            const selectedStatus = removeWhitespace($('#filterableStatusDropdown').val() || []).toLowerCase();
            const projectStatus = removeWhitespace(data[2]).toLowerCase();

            if (selectedStatus.length == 0) {
                return true;
            }

            if (selectedStatus.length > 0 && selectedStatus.includes(projectStatus)) {
                $('#status-tabs a.active').removeClass('active');
                return true;
            } else {
                return false;
            }
        }

        function findByNameANDComment(data) {
            const searchProject = removeWhitespace($('#searchProject').val()).toLowerCase();
            const projectName = removeWhitespace(data[3]).toLowerCase();
            const projectComment = removeWhitespace(data[4]).toLowerCase();

            if (searchProject.length > 0 &&
                projectName.indexOf(searchProject) !== -1 ||
                projectComment.indexOf(searchProject) !== -1)
                return true;

            return false;
        }

        function findByPriority(data) {
            const selectedPriority = $('#filterablePriorityDropdown').val() || [];
            const projectPriority = removeWhitespace(data[6]).toLowerCase();

            if (selectedPriority.length === 0) {
                return true;
            }

            if (selectedPriority.length > 0 && selectedPriority.some(priority => priority === projectPriority)) {
                return true;
            }
        }

        function findByDateRange(data) {
            let selectedDateRange = $('#filterableDaterange').val();
            let projectCreatedAt = data[9];


            if (selectedDateRange) {
                var dateRange = selectedDateRange.split(' - ');
                var startDate = moment(dateRange[0], 'MM/DD/YYYY');
                var endDate = moment(dateRange[1], 'MM/DD/YYYY');
                var projectDate = moment(projectCreatedAt, 'DD-MM-YYYY HH:mm');

                if (!projectDate.isBetween(startDate, endDate, undefined, '[]')) {
                    return false;
                }
            }

            return true;
        }

        function findByBudgetRnage(data) {
            let minBudget = parseFloat($('#filter_price_from').val());
            let maxBudget = parseFloat($('#filter_price_to').val());
            const projectBudget = parseFloat(data[8]);

            if (minBudget && projectBudget <= minBudget || maxBudget && projectBudget >= maxBudget) {
                return false;
            } else {
                return true;
            }
        }

        $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
            if (isVisible) {
                $('.data-sub-name').fadeIn(600);
            } else {
                $('.data-sub-name').fadeOut(600);
            }
            return findByTabStatus(data) && projectVisibility(data) && findByNameANDComment(data) && findByPriority(data) && findByBudgetRnage(data) && findByDateRange(data);
        });

        // const rangeInput = $(".range-input input");
        // const priceInput = $(".price-input input");
        // const range = $(".slider_filter .progress");
        // let priceGap = 1;

        // // Update range input values based on price inputs
        // priceInput.on('input', function () {
        //     let minPrice = parseInt(priceInput.eq(0).val());
        //     let maxPrice = parseInt(priceInput.eq(1).val());

        //     if (maxPrice - minPrice >= priceGap && maxPrice <= parseInt(rangeInput.eq(1).attr('max'))) {
        //         if ($(this).hasClass("input-min")) {
        //             rangeInput.eq(0).val(minPrice);
        //             range.css('left', (minPrice / parseInt(rangeInput.eq(0).attr('max'))) * 100 + "%");
        //         } else {
        //             rangeInput.eq(1).val(maxPrice);
        //             range.css('right', 100 - (maxPrice / parseInt(rangeInput.eq(1).attr('max'))) * 100 + "%");
        //         }
        //     }
        // });

        // // Update price inputs based on range input values
        // rangeInput.on('input', function () {
        //     let minVal = parseInt(rangeInput.eq(0).val());
        //     let maxVal = parseInt(rangeInput.eq(1).val());

        //     if (maxVal - minVal < priceGap) {
        //         if ($(this).hasClass("range-min")) {
        //             rangeInput.eq(0).val(maxVal - priceGap);
        //         } else {
        //             rangeInput.eq(1).val(minVal + priceGap);
        //         }
        //     } else {
        //         priceInput.eq(0).val(minVal);
        //         priceInput.eq(1).val(maxVal);
        //         range.css('left', (minVal / parseInt(rangeInput.eq(0).attr('max'))) * 100 + "%");

        //         // Calculate width and set it to the progress bar
        //         let width = (maxVal - minVal) / parseInt(rangeInput.eq(1).attr('max')) * 100 + "%";
        //         range.css('width', width);
        //     }
        // });

        function removeSymbol(input) {
            return input.replace(/[€\s]/g, '');
        }

        function removeSelectedWords(inputWord) {
            const wordsToRemove = ["lvprufen!", "ruckruf"];

            const regex = new RegExp(`(${wordsToRemove.join('|')})`, 'gi');
            return inputWord.replace(regex, '').replace(/\s+/g, ' ').trim();
        }
    }
    loadDataTables();

    function loadTabMenuPagination() {
        var projectsPerPage = 25;

        function initPaginationForTab(tabContentId) {
            var totalProjects = document.querySelectorAll(`#${tabContentId} a.tab-link`).length;
            var currentVisibleProjects = projectsPerPage;

            function hideProjects(fromIndex) {
                var projectItems = document.querySelectorAll(`#${tabContentId} .tab-item`);
                for (var i = fromIndex; i < totalProjects; i++) {
                    projectItems[i].style.display = 'none';
                }
            }

            function showProjects(fromIndex, toIndex) {
                var projectItems = document.querySelectorAll(`#${tabContentId} .tab-item`);
                for (var i = fromIndex; i < toIndex && i < totalProjects; i++) {
                    projectItems[i].style.display = 'list-item';
                }
            }

            function updateButtonLabel(number, isLess) {
                var btn = document.querySelector(`#${tabContentId} .pagination-btn`);
                if (isLess) {
                    btn.innerText = `Show Less Projects`;
                } else {
                    btn.innerText = `Show More ${number} Projects`;
                }
            }

            // Create the button dynamically if totalProjects exceeds projectsPerPage
            if (totalProjects > projectsPerPage) {
                var tabContent = document.getElementById(tabContentId);
                var button = document.createElement('div');
                button.classList = 'pagination-btn font-semibold mb-3 mt-3 pointer text-center';
                button.innerText = `Show More ${projectsPerPage} Projects`;
                tabContent.appendChild(button); // Append the button to the tab content

                button.addEventListener('click', function (event) {
                    event.preventDefault();
                    if (currentVisibleProjects >= totalProjects) {
                        currentVisibleProjects = projectsPerPage;
                        hideProjects(currentVisibleProjects);
                        updateButtonLabel(projectsPerPage, false);
                    } else {
                        var nextVisible = currentVisibleProjects + projectsPerPage;

                        nextVisible = Math.min(nextVisible, totalProjects);

                        showProjects(currentVisibleProjects, nextVisible);
                        currentVisibleProjects = nextVisible;

                        if (currentVisibleProjects >= totalProjects) {
                            updateButtonLabel(0, true);
                        } else {
                            updateButtonLabel(projectsPerPage, false);
                        }
                    }
                });

                hideProjects(currentVisibleProjects); // Hide projects exceeding projectsPerPage
                updateButtonLabel(projectsPerPage, false);
            } else {
                // If totalProjects is less than or equal to projectsPerPage, show all projects
                var projectItems = document.querySelectorAll(`#${tabContentId} .tab-item`);
                projectItems.forEach(item => {
                    item.style.display = 'list-item';
                });
            }
        }

        $('#project a.nav-link').each(function () {
            var tabContentId = $(this).attr('id').replace('tab-', '');
            initPaginationForTab(tabContentId);
        });
    }

    $('#searchInput').on('input', function () {
        const searchTerm = $(this).val().toLowerCase();

        if (searchTerm.length <= 0) {
            $('.pagination-btn').show();
            return;
        };

        if (!$('#allprojects').hasClass('active')) {
            $('.tab-pane.fade').removeClass('active show');
            $('#allprojects').addClass('active show');
        }

        $('#allprojects li.tab-item').each(function () {
            const projectName = $(this).find('a').text().toLowerCase();
            const isMatch = projectName.includes(searchTerm);
            $(this).toggle(isMatch);
            $('.pagination-btn').hide();
        });

    });

    loadTabMenuPagination();

    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /** call ajaxComplete after open data-popup **/
    // $(document).ajaxComplete(function (event, xhr, settings) {

    //     function loadQuickViewer(projectID) {

    //         $('#changeProjectMember').select2({
    //             placeholder: "Nutzer wählen",
    //             tags: true,
    //             allowHtml: true,
    //             templateSelection: function (data, container) {
    //                 $(container).css("background-color", $(data.element).data("background_color"));
    //                 if (data.element) {
    //                     $(container).css("color", $(data.element).data("font_color"));
    //                 }
    //                 return data.text;
    //             }
    //         })
    //             .on('select2:open', function () {
    //                 $('.select2-container.select2-container--open').css({
    //                     zIndex: 99999999,
    //                 });
    //             })
    //             .on('change', function (event) {
    //                 const projectID = $(this).data('projectid');
    //                 const userID = $(this).val();

    //                 $.ajax({
    //                     url: route('project.member.add', projectID),
    //                     type: "POST",
    //                     data: { users: userID },
    //                     success: function (data) {
    //                         if (data.is_success) {
    //                             $('.projectteamcount').html(data.count);
    //                             toastrs('Success', data.message, 'success');
    //                         } else {
    //                             toastrs('Error', data.message, 'error');
    //                         }
    //                     },
    //                     error: function (jqXHR, textStatus, errorThrown) {
    //                         toastrs('Error', 'Something went wrong: ' + textStatus, 'error');
    //                     }
    //                 });
    //             });

    //         $.ajax({
    //             url: route('project.get_all_address', projectID),
    //             type: "POST",
    //             data: { html: true },
    //             success: function (response) {
    //                 if (response.status == true) {
    //                     $(".project_all_address").html(response.html_data);
    //                 }
    //             }
    //         });

    //         $('.filter_select2').select2({
    //             placeholder: "Select",
    //             multiple: true,
    //             tags: true,
    //             templateSelection: function (data, container) {
    //                 $(container).css("background-color", $(data.element).data("background_color"));
    //                 if (data.element) {
    //                     $(container).css("color", $(data.element).data("font_color"));
    //                 }
    //                 return data.text;
    //             }
    //         }).on('select2:open', function () {
    //             $('.select2-container.select2-container--open').css({
    //                 zIndex: 99999999,
    //             });
    //         });

    //         $(document).on('change', '.filter_select2', function (event) {
    //             const labelType = $(this).data('labeltype');
    //             const ids = $(this).val().join(", ");
    //             if (!labelType && !ids) return;

    //             $.ajax({
    //                 url: route('project.add.status_data', projectID),
    //                 type: "POST",
    //                 data: {
    //                     field: labelType,
    //                     field_value: ids
    //                 },
    //                 success: function (data) {
    //                     if (data.is_success) {
    //                         toastrs('Success', data.message, 'success');
    //                     } else {
    //                         toastrs('Error', data.message, 'error');
    //                     }
    //                 }
    //             });
    //         });

    //         $(document).on('change', '#construction-select', function () {
    //             var selectedOption = $('#construction-select option:selected');
    //             var selectedType = selectedOption.data('type');
    //             var clientTypeInput = document.getElementById('client_type1');

    //             if (selectedType !== undefined && selectedType !== null) {
    //                 clientTypeInput.value = selectedType;
    //             } else {
    //                 clientTypeInput.value = 'new';
    //             }

    //             var url = route('users.get_user');
    //             var user_id = this.value;

    //             // Get the selected values
    //             if (user_id) {
    //                 axios.post(url, {
    //                     'user_id': user_id,
    //                     'from': 'construction'
    //                 }).then((response) => {

    //                     var clientDetailsElement = document.getElementById('construction-details');

    //                     $('#construction-details').html(response.data.html_data);
    //                     $('#construction_detail_id').val(response.data.user_id);

    //                     if ($('#construction_detail-company_notes').length > 0) {
    //                         init_tiny_mce('#construction_detail-company_notes');
    //                     }

    //                     // Remove the d-none class if the element is found
    //                     if (clientDetailsElement) {
    //                         clientDetailsElement.classList.remove('d-none');
    //                     }

    //                     initGoogleMapPlaced('construction_detail-autocomplete', 'construction_detail');


    //                     $(".country_select2").select2({
    //                         placeholder: "Country",
    //                         multiple: false,
    //                         dropdownParent: $("#title_form"),
    //                         placeholder: "Select an country",
    //                         allowClear: true,
    //                         dropdownAutoWidth: true,
    //                     });
    //                 })
    //             } else {
    //                 var clientDetailsElement = document.getElementById('construction-details');
    //                 // Remove the d-none class if the element is found
    //                 if (clientDetailsElement) {
    //                     clientDetailsElement.classList.add('d-none');
    //                 }
    //             }
    //         });

    //         $(document).on('change', '#client-select', function () {
    //             var selectedOption = $('#client-select option:selected');
    //             var selectedType = selectedOption.data('type');
    //             var clientTypeInput = document.getElementById('client_type');

    //             if (selectedType !== undefined && selectedType !== null) {
    //                 clientTypeInput.value = selectedType;
    //             } else {
    //                 clientTypeInput.value = 'new';
    //             }
    //             var url;

    //             var url = route('users.get_user');

    //             init_tiny_mce('.client-company_notes');

    //             // Get the selected values
    //             if (this.value) {
    //                 axios.post(url, {
    //                     'user_id': this.value,
    //                     'from': 'client'
    //                 }).then((response) => {
    //                     var clientDetailsElement = document.getElementById('client-details');

    //                     $('#client-details').html(response.data.html_data);
    //                     $('#client_id').val(response.data.user_id);
    //                     // initialize();

    //                     if ($('#client-company_notes').length > 0) {
    //                         init_tiny_mce('#client-company_notes');
    //                     }

    //                     // Remove the d-none class if the element is found
    //                     if (clientDetailsElement) {
    //                         clientDetailsElement.classList.remove('d-none');
    //                     }

    //                     initGoogleMapPlaced('invoice-autocomplete', 'invoice');

    //                 })
    //             } else {
    //                 var clientDetailsElement = document.getElementById('client-details');
    //                 // Remove the d-none class if the element is found
    //                 if (clientDetailsElement) {
    //                     clientDetailsElement.classList.add('d-none');
    //                 }
    //             }
    //         });
    //     }
    //     if (settings.url.includes('project/quick-view')) {
    //         const url = settings.url.split('?')[0];
    //         const triggerElement = $('a[data-url="' + url + '"]');
    //         const projectID = triggerElement.data('projectid');

    //         loadQuickViewer(projectID);
    //     }
    // });

});



