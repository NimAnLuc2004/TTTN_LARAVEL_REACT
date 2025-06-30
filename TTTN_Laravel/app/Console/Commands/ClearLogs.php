<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Log;
use Carbon\Carbon;

class ClearLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'logs:clear';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Xóa các bảng ghi log tạo trên 30 ngày';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = 30;
        $count = Log::where('created_at', '<', now()->subDays($days))->count();
        
        if ($this->confirm("Bạn có chắc muốn xóa {$count} bản ghi log cũ hơn {$days} ngày?")) {
            $deleted = Log::where('created_at', '<', now()->subDays($days))->delete();
            $this->info("Đã xóa thành công {$deleted} bản ghi log cũ");
            logger()->channel('stderr')->info("Đã xóa {$deleted} logs");
            return 0;
        }
        
        $this->error('Đã hủy thao tác xóa log');
        return 1;
    }
}
