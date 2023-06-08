<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\FilesTableviewWebclientPlugin;

/**
 * Replaces folders and files list view template in Files module for displaying items in table.
 *
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2023, Afterlogic Corp.
 *
 * @property Settings $oModuleSettings
 *
 * @package Modules
 */
class Module extends \Aurora\System\Module\AbstractWebclientModule
{
    public function init()
    {
    }

    /**
     * @return Module
     */
    public static function getInstance()
    {
        return parent::getInstance();
    }

    /**
     * @return Module
     */
    public static function Decorator()
    {
        return parent::Decorator();
    }

    /**
     * @return Settings
     */
    public function getModuleSettings()
    {
        return $this->oModuleSettings;
    }

    /**
     * Obtains list of module settings for authenticated user.
     *
     * @return array
     */
    public function GetSettings()
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        $oUser = \Aurora\System\Api::getAuthenticatedUser();
        if ($oUser && $oUser->isNormalOrTenant()) {
            return array(
                'EnableModule' => $oUser->getExtendedProp(self::GetName().'::EnableModule'),
                'EnablePreviewPane' => $oUser->getExtendedProp(self::GetName().'::EnablePreviewPane')
            );
        }

        return null;
    }

    /**
     * Updates settings of the Simple Chat Module.
     *
     * @param boolean $EnableModule indicates if user turned on Simple Chat Module.
     * @return boolean
     */
    public function UpdateSettings($EnableModule, $EnablePreviewPane)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        $iUserId = \Aurora\System\Api::getAuthenticatedUserId();
        if (0 < $iUserId) {
            $oUser = \Aurora\Modules\Core\Module::Decorator()->GetUserWithoutRoleCheck($iUserId);
            $oUser->setExtendedProp(self::GetName().'::EnableModule', $EnableModule);
            $oUser->setExtendedProp(self::GetName().'::EnablePreviewPane', $EnablePreviewPane);
            \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($oUser);
        }
        return true;
    }
}
