var API_URL = 'https://api.shutterstock.com/v2';

function encodeAuthorization() {
    var clientId = $('input[name=client_id]').val();
    var clientSecret = $('input[name=client_secret]').val();
    if (!clientId || !clientSecret) {
        $('#collapseAuthentication').collapse('show');
        alert('Client id and/or client secret are missing in the API key section, with out these you wont be able to contact the API.');
        return;
    }
    return 'Basic ' + window.btoa(clientId + ':' + clientSecret);
}

function search(opts, mediaType) {
    var $container = $('#' + mediaType + '-search-results');
    var createComponentFunc = renderImageComponent;
    authorization = encodeAuthorization();
    if (!authorization) return;
    var jqxhr = $.ajax({
        url: API_URL + '/' + mediaType + 's/search',
        data: opts,
        headers: {
            Authorization: authorization
        }
    }).done(function (data) {
        var minHeightCSS = /horizontal/.test(opts) ? 'horizontal-image' : 'vertical-image';
        $('#image-search-results').empty();
        $.each(data.data, function (i, item) {
            var component = createComponentFunc(item, minHeightCSS);
            $container.append(component);
        });
    });
    return jqxhr;
}

function renderImageComponent(image, minHeightCSS) {
    if (!image || !image.assets || !image.assets.huge_thumb || !image.assets.huge_thumb.url) return;
    var wrapper = $('<div>');
    var thumbWrapper = $('<div>');
    var thumbnail = $('<img>');
    var anchor = $('<a>');
    var description = $('<p>');
    $(thumbnail).attr('id', image.id).attr('src', image.assets.huge_thumb.url).attr('title', image.description);
    $(anchor).attr('href', 'http://shutterstock.7eer.net/c/489458/58340/1305?sharedid=pico-api&subId1=pico-api&u=http%3A%2F%2Fwww.shutterstock.com%2Fpic.mhtml%3Fid%3D' + image.id).attr('target', '_blank').attr('rel', 'nofollow').append(thumbnail);
    $(thumbWrapper).addClass('thumbnail-crop').append(anchor);
    $(wrapper).addClass('image-float-wrapper image ' + minHeightCSS).append(thumbWrapper);
    return wrapper;
}
$(function () {
    $('#search-form').submit(function (e) {
        e.preventDefault();
        // Clear current media results
        $('#image-search-results').empty();
        // Serialize form options
        var opts = $('input').filter(function () {
            if (this.value === '#999999') return;
            if (this.name === 'client_id') return;
            if (this.name === 'client_secret') return;
            return !!this.value;
        }).serialize();
        search(opts, 'image');
        var perPage = $('select[name=per_page]').val();
        if (perPage > 24) {
            opts = opts.replace('per_page=' + perPage, 'per_page=' + perPage / 2);
        }
        return false;
    });
    $('#search-form').submit();
});
