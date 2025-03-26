import { RxTriangleDown, RxTriangleUp } from "react-icons/rx";

export function TermsText({
    title,
    isExpanded,
    onToggle,
}: {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="mb-4">
            <div className="flex items-center justify-between cursor-pointer" onClick={onToggle}>
                <h3 className="text-lg font-medium text-orange-400 mb-2">{title}</h3>
                {isExpanded ? <RxTriangleUp size={20} /> : <RxTriangleDown size={20} />}
            </div>
            <div 
                id="kc-registration-terms-text" 
                className={`prose prose-sm max-w-none text-orange-300 overflow-y-auto transition-all duration-300 ${
                    isExpanded ? 'max-h-80 border border-gray-200 p-2' : 'max-h-0 overflow-hidden border-0 p-0'
                }`}
            >
                <div className="space-y-4">
                    <p><strong>Last Updated:</strong> Mar 26, 2025</p>
                    
                    <div>
                        <h4 className="font-medium">1. Acceptance of Terms</h4>
                        <p>By using KeyToMarvel.com ("the Service"), you agree to these Terms of Service.</p>
                    </div>

                    <div>
                        <h4 className="font-medium">2. Basic Rules</h4>
                        <ul className="list-disc pl-5">
                            <li>Don't use the Service for anything illegal</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium">3. Your Content</h4>
                        <p>You own what you create, but you give us permission to display it on our platform.</p>
                    </div>

                    <div>
                        <h4 className="font-medium">4. Our Rights</h4>
                        <p>We may:</p>
                        <ul className="list-disc pl-5">
                            <li>Modify or discontinue the Service at any time</li>
                            <li>Remove content that violates these terms</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium">5. No Warranty</h4>
                        <p>The Service is provided "as is" without warranties of any kind.</p>
                    </div>

                    <div>
                        <h4 className="font-medium">6. Limitation of Liability</h4>
                        <p>We're not liable for any damages resulting from your use of the Service.</p>
                    </div>

                    <div>
                        <h4 className="font-medium">7. Changes to Terms</h4>
                        <p>We may update these terms occasionally. Continued use means you accept the changes.</p>
                    </div>

                    <div>
                        <h4 className="font-medium">8. Contact</h4>
                        <p>Questions? Email us at: support@whereq.com</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 mt-6">
                        <p><strong>最后更新日期:</strong> 2025年3月26日</p>
                        
                        <div>
                            <h4 className="font-medium">1. 条款接受</h4>
                            <p>使用 KeyToMarvel.com ("本服务") 即表示您同意本服务条款。</p>
                        </div>

                        <div>
                            <h4 className="font-medium">2. 基本规则</h4>
                            <ul className="list-disc pl-5">
                                <li>不得将本服务用于任何非法用途</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium">3. 您的内容</h4>
                            <p>您保留所创建内容的所有权，但您授予我们在平台上展示这些内容的权限。</p>
                        </div>

                        <div>
                            <h4 className="font-medium">4. 我们的权利</h4>
                            <p>我们有权：</p>
                            <ul className="list-disc pl-5">
                                <li>随时修改或终止本服务</li>
                                <li>删除违反本条款的内容</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium">5. 免责声明</h4>
                            <p>本服务按"现状"提供，不附带任何形式的保证。</p>
                        </div>

                        <div>
                            <h4 className="font-medium">6. 责任限制</h4>
                            <p>对于您使用本服务造成的任何损害，我们不承担法律责任。</p>
                        </div>

                        <div>
                            <h4 className="font-medium">7. 条款变更</h4>
                            <p>我们可能会不定期更新本条款。继续使用即表示您接受变更。</p>
                        </div>

                        <div>
                            <h4 className="font-medium">8. 联系我们</h4>
                            <p>如有疑问，请发送邮件至：support@whereq.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}