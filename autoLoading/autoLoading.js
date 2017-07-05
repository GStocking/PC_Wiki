/**
 * Created by Y_G_G on 2017/7/5.
 */
$(function () {
    var myNotification = {
        basePath: $('#basePath').val(),
        isLoading: false,//是否正在加载
        isLoaded:false,//是够已经加载完成
        PageIndex:1,
        PageSize: 8,
        init: function () {
            this.getNoticeList();
            this.bindEvent();
        },
        bindEvent: function () {

            var self= this,
                scrollTimer;
            $(window).on('scroll', function () {
                if (scrollTimer) {
                    clearTimeout(scrollTimer);
                }
                scrollTimer = setTimeout(function () {
                    var bottom = $(document).height() - ($(window).scrollTop() + $(window).height());
                    if (bottom < 30) {
                        self.getNoticeList();
                    }
                }, 20);
            });

            $('.page-content').on('click','i', function () {
                $(this).toggleClass('toggle-unfold');
                $(this).parent().next().slideToggle();
            });
        },
        getNoticeList: function () {
            var self = this;

            $.ajax({
                url: self.basePath + 'knowledge/getnoticelist',
                type: 'POST',
                data: {
                    PageIndex: self.PageIndex,
                    PageSize: self.PageSize
                },
                success: function (data) {
                    if (self.isLoading || self.isLoaded) {
                        return;
                    }
                    if (data && data.Data && data.Data.Results && data.Data.Results.length) {
                        var data = data.Data.Results,
                            len = data.length,
                            strHtml = '',
                            iconHtml = '';
                        iconHtml += '<i><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiayiye"></use></svg></i>';
                        for (var i = 0; i < len; i++) {
                            var item = data[i];
                            strHtml += '<li>' + '<h3><span>' + item.Title + '</span><label>发表日期：' + item.NoticeTime.substring(0, 10) + '</label>' +
                                iconHtml + '</h3>' +
                                '<div>' + item.Content.replace(new RegExp('\n', 'gm'), '<br/>') + '</div>' + '</li>';

                        }
                        self.isLoading = true;
                        self.PageIndex++;
                        $('.page-wrapper .page-content > ul').append(strHtml);
                        if (len < self.PageSize) {
                            $('.data-loader').html('没有更多数据了....');
                            self.isLoaded = true;
                        } else {
                            $('.data-loader').html('加载更多....');
                        }
                    } else {
                        self.isLoaded = true;
                        $('.data-loader').html('没有更多数据了....');
                    }
                },
                complete: function () {
                    self.isLoading = false;
                },
                error: function () {
                    $('.data-loader').html('加载失败，请重试~');
                }
            });
        }
    };
    myNotification.init();
});