<?php

namespace App\JobPortal;

enum ExperienceRequirement: string
{
    case ONE = '<1 YoE';
    case ONE_TO_TWO = '1-2 YoE';
    case TWO_TO_THREE = '2-3 YoE';
    case THREE_TO_FOUR = '3-4 YoE';
    case FOUR_TO_FIVE = '4-5 YoE';
    case MORE_THAN_FIVE = '>5 YoE';

    public static function getMinimumPoints(): array
    {
        return [
            self::ONE->value => 145,
            self::ONE_TO_TWO->value => 290,
            self::TWO_TO_THREE->value => 435,
            self::THREE_TO_FOUR->value => 580,
            self::FOUR_TO_FIVE->value => 725,
            self::MORE_THAN_FIVE->value => 870,
        ];
    }

    public static function getByPoints(int $points): string
    {
        $minimumPoints = self::getMinimumPoints();
        $levels = array_keys($minimumPoints);

        if ($points < 145) {
            return self::ONE->value;
        }

        for ($i = count($levels) - 1; $i >= 0; $i--) {
            $currentLevel = $levels[$i];
            if ($points >= $minimumPoints[$currentLevel]) {
                return $currentLevel;
            }
        }

        return self::ONE->value;
    }
}
