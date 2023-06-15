def calculate_average(nums):
    if len(nums) == 0:
        return 0
    total = sum(nums)
    avg = total / len(nums)
    return avg