<tr class="item_row" data-itemID="{TEMPLATE_ID}" data-groupid="{TEMPLATE_GROUP_ID}" data-type="item">
    <td class="column_reorder">
        <i class="fa fa-bars reorder-item"></i>
    </td>

    <td class="column_checkbox">
        <input type="checkbox" class="item_selection" data-id="{TEMPLATE_ID}" data-groupid="{TEMPLATE_GROUP_ID}">
    </td>

    <td class="column_pos">
        <div class="pos-inner"></div>
    </td>

    <td class="column_name">
        <div class="div-desc-toggle">
            <i class="desc_toggle fa fas fa-solid fa-caret-right dt-control"></i>
            <input type="text" name="item[{TEMPLATE_ID}]['name']" class="item-name form-control heading"
                value="{{ trans('New Items') }}">
        </div>
    </td>

    <td class="column_quantity">
        <input type="text" class="form-control item-quantity"
            value="{{ currency_format_with_sym(0, '', '', false) }}">
    </td>

    <td class="column_unit">
        <input type="text" name="item[{TEMPLATE_ID}]['unit']" class="form-control item-unit" value="0,00">
    </td>

    <td class="column_optional border-right">
        <input type="checkbox" class="item-optional" value="{TEMPLATE_ID}">
    </td>

     @foreach ($allQuotes as $quoteItem)
        <td class="column_single_price border-left" data-cardQuoteID="{{ $quoteItem->id }}">
            <div class="d-flex"> 
                <input type="text" class="form-control item-price" 
                    id="cardQuoteSinglePrice" 
                    data-cardquotesingleprice="{{ $quoteItem->id }}" 
                    name="cardQuote[][{{ $quoteItem->id }}]" 
                    value="{{ currency_format_with_sym(0,00)  }}">
            </div>
        </td>
        
        <td class="column_total_price border-right" 
            id="cardQuoteTotalPrice" 
            data-cardquotetotalprice="{{ $quoteItem->id }}">-</td>
    @endforeach
</tr>

<tr class="item_child tr_child_description" 
    data-itemID="{TEMPLATE_ID}"
    data-groupid="{TEMPLATE_GROUP_ID}"
    style="display: none;">

    <td colspan="7" class="column_name desc_column border-right">
        <textarea 
            class="description_input w-100 tinyMCE" 
            id="description_{TEMPLATE_ID}"
            name="`item[{TEMPLATE_ID}][description]`"
            placeholder="{{ trans('Write a message') }}"></textarea>
    </td>

     @foreach ($allQuotes as $item)
        <td colspan="2" class="border-right text-center">-</td>
    @endforeach
</tr>
