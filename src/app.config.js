export default {
  pages: [
    "pages/index/index",
    "pages/diary/diary",
    "pages/mine/index/mine",
    "pages/account_book/index/account_book",
    "pages/account_book/control/account_control",
    "pages/account_book/add/add_record",
    "pages/discover/index/discover",
    "pages/schedule/index/schedule", // 待办事项页面
    "pages/diary/detail/index", // 日记详情页 (detail/index.vue)
    "pages/mine/personal_space/personal_space", // 个人空间页面
    "pages/mine/editor/profile_editor", // 个人资料编辑页
    "pages/diary/adddiary/adddiary",
    "pages/dev_page/dev_page/dev_page", // 开发者页面
    "pages/dev_page/SupabaseUpload/SupabaseUpload", // Supabase上传测试页面
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#ebf0f6", // 默认主题的primaryColor
    navigationBarTitleText: "DiaryVue",
    navigationBarTextStyle: "black",
  },
};
