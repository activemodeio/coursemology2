FactoryGirl.define do
  factory :instance_user do
    instance
    role :normal

    after(:build) do |instance_user|
      instance_user.user ||= build(:user, instance_users: [instance_user])
    end
  end
end
